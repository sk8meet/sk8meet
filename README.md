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

## Project Structure

The current project structure:

```text
sk8meet/
├── frontend/                      # React/Next.js frontend application
│   ├── package.json               # Frontend dependencies
│   └── tsconfig.json              # TypeScript configuration for frontend
│
├── backend/                       # Node.js/Express backend application
│   ├── package.json               # Backend dependencies
│   └── tsconfig.json              # TypeScript configuration for backend
│
└── documents/                     # Project documentation
```

The project will use separate code workspaces for frontend and backend development.
