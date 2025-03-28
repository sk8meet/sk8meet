# Sk8Meet

A platform for organizing street skating events.

## Vision

Sk8Meet aims to reduce the administrative burden on organizers while creating a more engaging and accessible experience for all participants. By providing specialized tools for event planning, marshal coordination, route management with skating-specific features, and community engagement, Sk8Meet supports the growth of street skating communities worldwide.

For a detailed overview of the project vision, see [Vision Document](documents/vision.md).

## Documentation

The project is thoroughly documented to provide a clear understanding of its requirements, architecture, and implementation plan:

- [Vision Document](documents/vision.md) - High-level non-technical overview of the project's goals and benefits
- [Requirements Summary](documents/requirements_summary.md) - Detailed breakdown of functional and non-functional requirements
- [User Stories](documents/user_stories.md) - User-centred requirements and MVP feature set
- [System Context](documents/system_context.md) - System boundaries and interactions with external systems
- [Architecture Document](documents/architecture.md) - Comprehensive technical architecture and design decisions
- [Development Plan](documents/development-plan.md) - Implementation strategy and timeline
- [Development Environment Guide](documents/dev-environment-guide.md) - Detailed setup instructions for developers

## Contributing

We welcome contributions to Sk8Meet! Please see our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct, development workflow, and pull request process.

## Development Setup

Sk8Meet uses a containerized development approach to ensure consistent environments across all platforms (Windows, Linux, macOS) with minimal software installation.

### Prerequisites

- Docker Desktop
- Git
- Visual Studio Code with Remote Containers extension

### Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/your-org/sk8meet.git
   cd sk8meet
   ```

2. Create a local environment file:

   ```bash
   cp .env.example .env.development
   ```

   Edit `.env.development` with appropriate values for your local environment.

3. Start the containers using one of these methods:

   **Option 1: Using Docker Compose directly**

   ```bash
   docker-compose up
   ```

   This option simply starts the containers using Docker Compose. You'll need to use your local code editor and tools to work with the code. This is a good option if you prefer to use your existing development environment or don't want to use VS Code.

   **Option 2: Using VS Code Remote Containers**

   The project uses separate devcontainers for frontend and backend to provide isolated development environments:

   For backend development:

   ```bash
   code backend/backend.code-workspace
   ```

   For frontend development:

   ```bash
   code frontend/frontend.code-workspace
   ```

   When prompted, click "Reopen in Container" or use the command palette (F1) and select "Remote-Containers: Reopen in Container"

   This approach uses VS Code's Remote Containers extension to open each project component inside its dedicated development container. Each workspace is configured to access resources at the root level of the project (e.g., documentation), while providing a tailored environment with pre-configured extensions and settings specific to frontend or backend development.

   **Note about the Dev Container Configuration:**

   Each workspace is configured to:
   - Mount the entire project to allow access to shared resources
   - Forward the necessary ports (3001 for frontend, 4000 for backend, 5432 for PostgreSQL, 6379 for Redis)
   - Include the required extensions for the specific development environment

4. Access the development environment:
   - Frontend: <http://localhost:3001>
   - Backend API: <http://localhost:4000>

Note: Database migrations and seed data mentioned in the documentation are planned for future implementation.

## Project Structure

The current project structure:

```text
sk8meet/
├── frontend/                      # React/Next.js frontend application
│   ├── .devcontainer/             # Frontend devcontainer code
│   │   └── devcontainer.json      # Frontend devcontainer configuration file
│   ├── frontend.code-workspace    # VS Code workspace configuration for frontend
│   ├── Dockerfile                 # Frontend container configuration
│   ├── public/                    # Static assets
│   ├── src/                       # Frontend source code
│   │   └── pages/                 # Next.js pages
│   ├── next.config.js             # Next.js configuration
│   ├── package.json               # Frontend dependencies
│   └── tsconfig.json              # TypeScript configuration for frontend
│
├── backend/                       # Node.js/Express backend application
│   ├── .devcontainer/             # Backend devcontainer code
│   │   └── devcontainer.json      # Backend devcontainer configuration file
│   ├── backend.code-workspace     # VS Code workspace configuration for backend
│   ├── Dockerfile                 # Backend container configuration
│   ├── src/                       # Backend source code
│   ├── package.json               # Backend dependencies
│   └── tsconfig.json              # TypeScript configuration for backend
│
├── docker-compose.yml             # Docker Compose configuration
├── documents/                     # Project documentation
└── .env.example                   # Example environment variables
```

The project uses separate code workspaces for frontend and backend development, each configured to access resources at the root level of the project. This approach allows developers to work in isolated environments tailored to their specific needs while still maintaining access to shared resources like documentation.

## Running Tests

### Backend Tests

The backend uses Jest for testing. To run tests, navigate to the `backend/` directory and use the following npm scripts:

- Run tests once:

  ```bash
  npm test
  ```

- Run tests in watch mode (automatically re-run tests on file changes):

  ```bash
  npm run test:watch
  ```

- Generate test coverage report:

  ```bash
  npm run test:coverage
  ```

Note: These commands should be run inside the backend development container to ensure the correct environment and dependencies.
