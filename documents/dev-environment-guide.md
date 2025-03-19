# Sk8Meet Development Environment Guide

This document provides detailed guidance on setting up and working with the Sk8Meet development environment, with special focus on containerization, consistent environments, and cross-platform support.

## Table of Contents

1. [Core Development Environment](#core-development-environment)
2. [Setting Up Offline Development Capabilities for the PWA](#setting-up-offline-development-capabilities-for-the-pwa)
3. [Configuring the OpenStreetMap Integration](#configuring-the-openstreetmap-integration)
4. [Implementing the Modular Monolith Structure](#implementing-the-modular-monolith-structure)
5. [Managing Database Schemas and Migrations](#managing-database-schemas-and-migrations)
6. [Developer Onboarding Process](#developer-onboarding-process)
7. [Troubleshooting Common Issues](#troubleshooting-common-issues)

## Core Development Environment

### Essential Tools

1. **Docker and Docker Compose**
   - Provides consistent development environments across all platforms
   - Eliminates "works on my machine" problems
   - Allows developers to run the entire stack locally without installing language runtimes, databases, etc.

2. **Visual Studio Code with Remote Containers extension**
   - Allows developers to work inside a container with full IDE capabilities
   - Provides consistent editor experience with pre-configured extensions
   - Works across Windows, Linux, and macOS

3. **Git**
   - Required for version control
   - Works consistently across all platforms

4. **GitHub CLI (gh)**
   - Simplifies GitHub workflow integration
   - Consistent experience across platforms

### Development Workflow

We implement a **Dev Container** approach with the following components:

1. **Dev Container Configuration**
   - `.devcontainer` directory with configuration for VS Code Remote Containers
   - All necessary development tools, extensions, and configurations pre-installed
   - Consistent environment across all developer machines

2. **Docker Compose for Local Development**
   - `docker-compose.yml` for local development that includes:
     - Frontend container (Node.js with Next.js)
     - Backend container (Node.js with Express)
     - PostgreSQL database container
     - Redis container for caching
   - Source code mounted as volumes for live reloading
   - Hot-reloading for both frontend and backend

3. **Infrastructure as Code for Development**
   - Terraform for defining development infrastructure
   - Configuration stored in version control
   - Isolated cloud resources for developers when needed

## Setting Up Offline Development Capabilities for the PWA

The Sk8Meet application requires robust offline capabilities, especially for marshals in the field. Here's how we implement this in the development environment:

### 1. Service Worker Configuration

```javascript
// frontend/next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development' && !process.env.ENABLE_PWA,
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.mapbox\.com\//,
      handler: 'CacheFirst',
      options: {
        cacheName: 'mapbox-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
    {
      urlPattern: /^https:\/\/tile\.openstreetmap\.org\//,
      handler: 'CacheFirst',
      options: {
        cacheName: 'osm-tiles-cache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
    // Add other caching strategies for API endpoints, static assets, etc.
  ],
});

module.exports = withPWA({
  // other Next.js config
});
```

### 2. Offline Data Synchronization

We use IndexedDB for local data storage and synchronization:

```javascript
// frontend/src/lib/db.js
import { openDB } from 'idb';

const initDB = async () => {
  return openDB('sk8meet-db', 1, {
    upgrade(db) {
      // Create object stores for offline data
      if (!db.objectStoreNames.contains('events')) {
        db.createObjectStore('events', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('routes')) {
        db.createObjectStore('routes', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('syncQueue')) {
        db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

export const db = {
  async getEvents() {
    const db = await initDB();
    return db.getAll('events');
  },
  async saveEvent(event) {
    const db = await initDB();
    await db.put('events', event);
    // Add to sync queue if offline
    if (!navigator.onLine) {
      await db.add('syncQueue', {
        action: 'saveEvent',
        data: event,
        timestamp: Date.now(),
      });
    }
  },
  // Similar methods for routes and other data types
};
```

### 3. Background Sync Setup

```javascript
// frontend/src/service-worker.js
import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { registerRoute } from 'workbox-routing';
import { NetworkOnly } from 'workbox-strategies';

const bgSyncPlugin = new BackgroundSyncPlugin('sk8meet-sync-queue', {
  maxRetentionTime: 24 * 60, // Retry for up to 24 hours (in minutes)
});

// Register routes that should be synced when back online
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/events'),
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  'POST'
);

// Add similar routes for other API endpoints that need offline support
```

### 4. Testing Offline Capabilities in Development

Add a Docker Compose service for testing offline capabilities:

```yaml
# docker-compose.override.yml
services:
  offline-test:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    volumes:
      - ./frontend:/workspace/frontend
      - frontend_node_modules:/workspace/frontend/node_modules
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=development
      - API_URL=http://backend:4000
      - ENABLE_PWA=true
    depends_on:
      - backend
    command: npm run dev
```

### 5. Development Workflow for Offline Features

1. **Toggle Network Conditions**: Use Chrome DevTools to simulate offline conditions
2. **Offline-First Development**: Design features with offline usage in mind from the start
3. **Sync Testing**: Test synchronization when coming back online
4. **Conflict Resolution**: Implement and test conflict resolution strategies

## Configuring the OpenStreetMap Integration

The Sk8Meet application relies heavily on OpenStreetMap for route planning and navigation. Here's how to set up the integration in the development environment:

### 1. OpenStreetMap API Configuration

```javascript
// backend/src/config/osm.js
module.exports = {
  tileServer: process.env.OSM_TILE_SERVER || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  nominatimServer: process.env.OSM_NOMINATIM_SERVER || 'https://nominatim.openstreetmap.org',
  overpassServer: process.env.OSM_OVERPASS_SERVER || 'https://overpass-api.de/api/interpreter',
  userAgent: 'Sk8Meet_Dev/1.0', // Important: Identify your app to OSM servers
  rateLimitRequests: 1, // Requests per second (be respectful of OSM servers)
  cacheExpiry: 60 * 60 * 24, // 24 hours in seconds
};
```

### 2. Local Tile Server for Development (Optional)

For heavy development without hitting OSM rate limits, set up a local tile server:

```yaml
# docker-compose.override.yml
services:
  tile-server:
    image: overv/openstreetmap-tile-server
    ports:
      - "8080:80"
    volumes:
      - osm-data:/var/lib/postgresql/12/main
      - osm-rendered-tiles:/var/lib/mod_tile
    environment:
      - DOWNLOAD_PBF=https://download.geofabrik.de/europe/great-britain-latest.osm.pbf
      # Use a smaller region for faster startup during development

volumes:
  osm-data:
  osm-rendered-tiles:
```

Update the frontend configuration to use the local tile server:

```javascript
// frontend/.env.development
NEXT_PUBLIC_OSM_TILE_SERVER=http://localhost:8080/tile/{z}/{x}/{y}.png
```

### 3. Leaflet Integration for the Frontend

```javascript
// frontend/src/components/Map/OSMMap.js
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

const OSMMap = ({ initialPosition = [51.505, -0.09], zoom = 13, routes = [] }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapInstanceRef.current) {
      // Initialize map
      mapInstanceRef.current = L.map(mapRef.current).setView(initialPosition, zoom);
      
      // Add tile layer
      L.tileLayer(process.env.NEXT_PUBLIC_OSM_TILE_SERVER || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
      
      // Add drawing controls for route creation
      const drawnItems = new L.FeatureGroup();
      mapInstanceRef.current.addLayer(drawnItems);
      
      const drawControl = new L.Control.Draw({
        draw: {
          polyline: {
            shapeOptions: {
              color: '#f357a1',
              weight: 5,
            }
          },
          polygon: false,
          circle: false,
          rectangle: false,
          marker: true,
        },
        edit: {
          featureGroup: drawnItems,
        }
      });
      
      mapInstanceRef.current.addControl(drawControl);
      
      // Handle drawing events
      mapInstanceRef.current.on(L.Draw.Event.CREATED, (event) => {
        const layer = event.layer;
        drawnItems.addLayer(layer);
        
        // If it's a polyline (route), extract coordinates
        if (event.layerType === 'polyline') {
          const coordinates = layer.getLatLngs().map(latLng => [latLng.lat, latLng.lng]);
          console.log('Route created:', coordinates);
          // Here you would typically save this to state or dispatch an action
        }
      });
    }
    
    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initialPosition, zoom]);
  
  // Update map when routes change
  useEffect(() => {
    if (mapInstanceRef.current && routes.length > 0) {
      // Clear existing routes
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.Polyline && !(layer instanceof L.Rectangle)) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });
      
      // Add new routes
      routes.forEach(route => {
        L.polyline(route.coordinates, {
          color: route.color || '#f357a1',
          weight: 5,
        }).addTo(mapInstanceRef.current);
      });
    }
  }, [routes]);
  
  return <div ref={mapRef} style={{ height: '500px', width: '100%' }} />;
};

export default OSMMap;
```

### 4. Backend Services for OSM Integration

```javascript
// backend/src/services/osmService.js
const axios = require('axios');
const config = require('../config/osm');
const redis = require('../lib/redis');

const osmService = {
  async geocode(query) {
    const cacheKey = `geocode:${query}`;
    const cachedResult = await redis.get(cacheKey);
    
    if (cachedResult) {
      return JSON.parse(cachedResult);
    }
    
    const response = await axios.get(`${config.nominatimServer}/search`, {
      params: {
        q: query,
        format: 'json',
        limit: 5,
      },
      headers: {
        'User-Agent': config.userAgent,
      },
    });
    
    await redis.set(cacheKey, JSON.stringify(response.data), 'EX', config.cacheExpiry);
    return response.data;
  },
  
  async reverseGeocode(lat, lon) {
    const cacheKey = `revgeocode:${lat},${lon}`;
    const cachedResult = await redis.get(cacheKey);
    
    if (cachedResult) {
      return JSON.parse(cachedResult);
    }
    
    const response = await axios.get(`${config.nominatimServer}/reverse`, {
      params: {
        lat,
        lon,
        format: 'json',
      },
      headers: {
        'User-Agent': config.userAgent,
      },
    });
    
    await redis.set(cacheKey, JSON.stringify(response.data), 'EX', config.cacheExpiry);
    return response.data;
  },
  
  async querySurfaceQuality(bbox) {
    // Query Overpass API for surface quality information
    const query = `
      [out:json];
      (
        way["surface"](${bbox});
        way["smoothness"](${bbox});
      );
      out body;
      >;
      out skel qt;
    `;
    
    const response = await axios.post(config.overpassServer, query, {
      headers: {
        'Content-Type': 'text/plain',
        'User-Agent': config.userAgent,
      },
    });
    
    return response.data;
  },
  
  // Additional methods for other OSM-related functionality
};

module.exports = osmService;
```

### 5. Rate Limiting and Caching Middleware

```javascript
// backend/src/middleware/osmRateLimit.js
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('../lib/redis');
const config = require('../config/osm');

const osmRateLimit = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'osm-ratelimit:',
  }),
  windowMs: 1000, // 1 second
  max: config.rateLimitRequests, // Limit each IP to N requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests to OSM services, please try again later',
});

module.exports = osmRateLimit;
```

## Implementing the Modular Monolith Structure

The Sk8Meet architecture is designed as a modular monolith with clear separation of concerns. Here's how to implement this structure within the containerized setup:

### 1. Backend Module Structure

```text
backend/
├── src/
│   ├── modules/
│   │   ├── user/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── models/
│   │   │   ├── dto/
│   │   │   ├── validators/
│   │   │   ├── routes.js
│   │   │   └── index.js
│   │   ├── event/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── models/
│   │   │   ├── dto/
│   │   │   ├── validators/
│   │   │   ├── routes.js
│   │   │   └── index.js
│   │   ├── marshal/
│   │   │   └── ...
│   │   ├── route/
│   │   │   └── ...
│   │   └── community/
│   │       └── ...
│   ├── core/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── lib/
│   │   └── errors/
│   ├── api/
│   │   ├── v1/
│   │   │   └── index.js
│   │   └── index.js
│   └── app.js
└── index.js
```

### 2. Module Boundaries and Communication

```javascript
// backend/src/modules/event/services/eventService.js
const userService = require('../../user/services/userService');
const routeService = require('../../route/services/routeService');
const eventRepository = require('../repositories/eventRepository');
const { EventNotFoundError, UnauthorizedError } = require('../../../core/errors');

const eventService = {
  async createEvent(eventData, userId) {
    // Cross-module boundary check
    const user = await userService.getUserById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }
    
    // Check if user has permission to create events
    const canCreateEvent = await userService.hasPermission(userId, 'event:create');
    if (!canCreateEvent) {
      throw new UnauthorizedError('User does not have permission to create events');
    }
    
    // If event has a route, validate it exists
    if (eventData.routeId) {
      const route = await routeService.getRouteById(eventData.routeId);
      if (!route) {
        throw new Error('Route not found');
      }
    }
    
    // Create the event
    return eventRepository.createEvent({
      ...eventData,
      creatorId: userId,
    });
  },
  
  // Other event-related methods
};

module.exports = eventService;
```

### 3. Database Schema Organization

```javascript
// backend/src/core/lib/db.js
const { Pool } = require('pg');
const config = require('../config/database');

const pool = new Pool({
  connectionString: config.connectionString,
});

// Create schemas for each module if they don't exist
const initializeSchemas = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Create schemas for each module
    await client.query('CREATE SCHEMA IF NOT EXISTS user_management');
    await client.query('CREATE SCHEMA IF NOT EXISTS event_management');
    await client.query('CREATE SCHEMA IF NOT EXISTS marshal_management');
    await client.query('CREATE SCHEMA IF NOT EXISTS route_management');
    await client.query('CREATE SCHEMA IF NOT EXISTS community_management');
    
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  initializeSchemas,
  query: (text, params) => pool.query(text, params),
};
```

### 4. API Gateway Implementation

```javascript
// backend/src/api/v1/index.js
const express = require('express');
const router = express.Router();

// Import module routes
const userRoutes = require('../../modules/user/routes');
const eventRoutes = require('../../modules/event/routes');
const marshalRoutes = require('../../modules/marshal/routes');
const routeRoutes = require('../../modules/route/routes');
const communityRoutes = require('../../modules/community/routes');

// Authentication middleware
const { authenticate } = require('../../core/middleware/auth');

// Public routes
router.use('/auth', userRoutes.authRoutes);
router.use('/public/events', eventRoutes.publicRoutes);
router.use('/public/organizations', userRoutes.publicOrganizationRoutes);
router.use('/public/routes', routeRoutes.publicRoutes);

// Protected routes
router.use('/users', authenticate, userRoutes.protectedRoutes);
router.use('/organizations', authenticate, userRoutes.organizationRoutes);
router.use('/events', authenticate, eventRoutes.protectedRoutes);
router.use('/marshals', authenticate, marshalRoutes.routes);
router.use('/routes', authenticate, routeRoutes.protectedRoutes);
router.use('/community', authenticate, communityRoutes.routes);

module.exports = router;
```

### 5. Event-Driven Communication Between Modules

```javascript
// backend/src/core/lib/eventBus.js
const EventEmitter = require('events');

class EventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(100); // Increase max listeners to avoid warnings
  }
}

const eventBus = new EventBus();

module.exports = eventBus;
```

Usage in modules:

```javascript
// backend/src/modules/event/services/eventService.js
const eventBus = require('../../../core/lib/eventBus');

// In the createEvent method
async createEvent(eventData, userId) {
  // ... existing code
  
  const event = await eventRepository.createEvent({
    ...eventData,
    creatorId: userId,
  });
  
  // Emit event for other modules to react to
  eventBus.emit('event:created', event);
  
  return event;
}
```

Listening in another module:

```javascript
// backend/src/modules/marshal/services/marshalService.js
const eventBus = require('../../../core/lib/eventBus');

// Set up event listeners
eventBus.on('event:created', async (event) => {
  // Notify marshals about new event
  await notifyMarshalsAboutNewEvent(event);
});

// ... rest of the service
```

### 6. Docker Compose Configuration for Modular Development

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    volumes:
      - ./backend:/workspace/backend
      - backend_node_modules:/workspace/backend/node_modules
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/sk8meet
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    command: npm run dev

  # Other services...

volumes:
  backend_node_modules:
  # Other volumes...
```

## Managing Database Schemas and Migrations

Consistent database schemas across developer environments are crucial. Here's how to manage them effectively:

### 1. Using Prisma for Database Management

```javascript
// backend/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = ["user_management", "event_management", "marshal_management", "route_management", "community_management"]
}

// User Management Schema
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  passwordHash  String
  firstName     String?
  lastName      String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relationships
  organizations    OrganizationMember[]
  events           Event[]
  marshalProfiles  MarshalProfile[]

  @@schema("user_management")
}

model Organization {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  members     OrganizationMember[]
  roles       OrganizationRole[]
  events      Event[]

  @@schema("user_management")
}

// Event Management Schema
model Event {
  id          String   @id @default(uuid())
  name        String
  description String?
  startDate   DateTime
  endDate     DateTime
  status      String   @default("draft") // draft, published, cancelled, completed
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Foreign keys
  creatorId       String
  organizationId  String
  routeId         String?

  // Relationships
  creator         User          @relation(fields: [creatorId], references: [id])
  organization    Organization  @relation(fields: [organizationId], references: [id])
  route           Route?        @relation(fields: [routeId], references: [id])
  marshalAssignments MarshalAssignment[]

  @@schema("event_management")
}

// Additional models for other schemas...
```

### 2. Migration Management

```javascript
// backend/src/scripts/migrate.js
const { execSync } = require('child_process');
const path = require('path');

// Ensure the DATABASE_URL environment variable is set
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

// Run Prisma migrations
try {
  console.log('Running database migrations...');
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '../../'),
  });
  console.log('Migrations completed successfully');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}
```

### 3. Seed Data for Development

```javascript
// backend/prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sk8meet.com' },
    update: {},
    create: {
      email: 'admin@sk8meet.com',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
    },
  });

  // Create sample organization
  const organization = await prisma.organization.upsert({
    where: { slug: 'london-skate' },
    update: {},
    create: {
      name: 'London Skate',
      slug: 'london-skate',
      description: 'The original London skating group',
    },
  });

  // Add admin as organization admin
  await prisma.organizationMember.upsert({
    where: {
      userId_organizationId: {
        userId: admin.id,
        organizationId: organization.id,
      },
    },
    update: {},
    create: {
      userId: admin.id,
      organizationId: organization.id,
      role: 'ADMIN',
    },
  });

  // Create sample roles
  const roles = [
    { name: 'Marshal', slug: 'marshal', organizationId: organization.id },
    { name: 'Lead Marshal', slug: 'lead-marshal', organizationId: organization.id },
    { name: 'Tail Marshal', slug: 'tail-marshal', organizationId: organization.id },
  ];

  for (const role of roles) {
    await prisma.organizationRole.upsert({
      where: {
        slug_organizationId: {
          slug: role.slug,
          organizationId: role.organizationId,
        },
      },
      update: {},
      create: role,
    });
  }

  // Add more seed data as needed...

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 4. Database Migration Workflow

1. **Creating Migrations**:

```bash
# In the backend container
npx prisma migrate dev --name add_new_feature
```

2. **Applying Migrations in Development**:

```bash
# Automatically run on container startup
npm run migrate
```

3. **Migration Verification**:

```javascript
// backend/src/core/middleware/databaseCheck.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const databaseCheck = async (req, res, next) => {
  try {
    // Check if database is accessible
    await prisma.$queryRaw`SELECT 1`;
    
    // Check if migrations are up to date
    const pendingMigrations = await prisma.$queryRaw`
      SELECT migration_name
      FROM _prisma_migrations
      WHERE applied_steps_count < migration_steps_count
    `;
    
    if (pendingMigrations.length > 0) {
      console.warn('Pending migrations detected:', pendingMigrations);
    }
    
    next();
  } catch (error) {
    console.error('Database check failed:', error);
    res.status(500).json({ error: 'Database connection error' });
  }
};

module.exports = databaseCheck;
```

### 5. Docker Compose Configuration for Database

```yaml
# docker-compose.yml
services:
  db:
    image: postgres:14
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_USER=postgres
      - POSTGRES_DB=sk8meet
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    # ... other configuration
    depends_on:
      db:
        condition: service_healthy
    command: sh -c "npm run migrate && npm run dev"

volumes:
  postgres_data:
```

## Developer Onboarding Process

1. **Prerequisites**:
   - Docker Desktop installed
   - Git installed
   - Visual Studio Code with Remote Containers extension

2. **Getting Started**:

   ```bash
   # Clone the repository
   git clone https://github.com/your-org/sk8meet.git
   cd sk8meet
   
   # Open in VS Code
   code .
   
   # When prompted, click "Reopen in Container"
   # Or use the command palette: "Remote-Containers: Reopen in Container"
   ```

3. **First-time Setup**:
   - The container will automatically install dependencies
   - Database migrations will run automatically
   - Seed data will be created for development

4. **Development Workflow**:
   - Frontend: <http://localhost:3000>
   - Backend API: <http://localhost:4000>
   - Database: postgresql://postgres:postgres@localhost:5432/sk8meet

For details on our contribution process, including pull request guidelines and commit message format, please refer to our [Contributing Guide](../CONTRIBUTING.md).

## Troubleshooting Common Issues

1. **Container Build Failures**:
   - Check Docker Desktop has sufficient resources
   - Try rebuilding with `docker-compose build --no-cache`

2. **Database Connection Issues**:
   - Ensure the database container is running: `docker-compose ps`
   - Check logs: `docker-compose logs db`
   - Verify connection string in environment variables

3. **Node Module Issues**:
   - Delete node_modules volumes: `docker-compose down -v`
   - Rebuild: `docker-compose up -d --build`

4. **Performance Issues on Windows/macOS**:
   - Enable WSL2 backend on Windows
   - Use gRPC FUSE on macOS
   - Consider mounting only necessary directories as volumes

5. **OpenStreetMap Rate Limiting**:
   - Check if you're hitting rate limits in the logs
   - Consider using a local tile server for development
   - Implement proper caching strategies
