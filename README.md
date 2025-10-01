# Chimera Backend Service

**High-Scale TypeScript Backend built with Clean Archtecture, NestJS, and PostgreSQL.**

![Github Workflow Status](https://github.com/OWNER/REPOSITORY/actions/workflows/main.yml/badge.svg)
![License](https://img.shields.io/badge/License-UNLICENSED-red)
![TypeScript](https://img.shields.io/badge/Typescript-5.x-blue)
![NestJS](https://img.shields.io/badge/NestJS-10.x-red)
![Docker Multi-Stage](https://img.shields.io/badge/Docker-Multi--Stage-informational)

---

## 1. Project Overview & Technical Philosophy

The Chimera Backend is designed following **Clean-Archtecture (Onion Archtecture)** principles, leveraging **Domain-Driven Design (DDD)** to separate core business logic from infrastructure concerns. This modularity ensutes high testabillity, maintainability, and horizontal scalability.

We strictly use **TypeScript** for robust typing, enhanced refactoring safetly, and code quality on a large-scale enterprise environment.

### Core Archtecture Layers
| Layer | Responsibility | Key Components | 
| :--- | :--- | :--- |
|**Domain** | Business Entities, Value Objects, Repository Interfaces (Ports). | Pure business rules, free of framework dependencies. |
|**Application** | Use Cases (`LoginUseCase`, `CreateUserUseCase`). Orchestrates the flow and enforces domain policies. | Input/Output DTOs (Commands/Queries). |
| **Infrastructure** | Adapters: Concrete implementations of external resources (DB, Crypto, API). | `UserRepository`(TypeORM), `BcryptService`. |
| **Interface** | Presentation: Handles external protocols (REST, GraphQL). Maps external DTOs to Application Commands. | Controllers, DTOs (Request/Response). Swagger documentation. |

### Technology Stack
| Component | Technology | Rationale |
|    :---   |    :---    |    :---   |
| **Language** | **TypeScript** | Strict typing and modern features (ES2022 target) |
| **Database** | **PostgreSQL** | Reliable, ACID-compliant, and robust for enterprise data integrity. |
| **ORM/DB** | **TypeORM** | Supports the Repository pattern required bu DDD. Used with explicit **Database Migrations**.
| **Security** | **JWT, bcrypt** | Stateless authentication via **JWT**; secure password hashing via **bcrypt** |
| **Testing** | **Jest** | Unit, Integration, and E2E testing standard. |

---

## 2. Local Setup and Prerequisites

Ensure you have the following installed:
 * Node.js (v20+)
 * Docker & Docker Compose
 * PostgreSQL (or use a Docker instance)

### A. Environment Configuration

1. Clone the repository:
```bash
git clone git@github.com:chimeraorg/chimera-backend.git
cd chimera-backend
```

2. Create a local `.env` file from the example:
```bash
cp .env.example .env
# NOTE: Set the correct DB crendentials and strong JWT_SECRET
```

### B. Dependencies and Development Server

1. Install dependencies: 
```bash
npm install
```

2. Start the development server with watch mode:
```bash
npm run start:dev
# Access: http://localhost:3000
# Swagger UI: http://localhost:3000/api/docs
```

### C. Database Management

We rely exclusively on migrations for schema changes.

1. **Generate Migration (Auto-generate SQL from TypeORM Entities):**
```bash
npm run migration:generate -- infrastructure/database/migrations/NewFeatureSchema
```

2. **Run Migrations (Apply to DB):
```bash
npm run migration:run
```

3. **Revert Last Migration:**
```bash
npm run migration:revert
```

---

## 3. Testing and Quality Gates


### A. Testing

All features must include corresponding Unit and Integration tests. E2E tests are required for major API flows.
| Script | Description |
| :--- | :--- |
`npm test` | Runs all Unit and Integration tests. |
`npm run test:cov` | Runs tests and generates a code coverate report. |
`npm run test:e2e` | Runs End-to-End tets (requires running application instance). |

### B. Linting & Formatting

We enforce strict ESLint and Prettier rules to maintain code standards.
| Script | Description |
| :--- | :--- |
`npm run lint` | Checks code against ESLint rules (fixes formatting issues). |
`npm run format` | Runs Prettier to auto-format the code. |

---

## 4. Documentation and API Reference

### A. API Documentation (OpenAPI/Swagger)

The API is automatically documented via NestJS Swagger module.

* Access the live documentation on the development server: `http:localhost:3000/api/docs`

---

## 5. Deployment (CI/CD)

The project uses a multi-stage `Dockerfile` for optimized, small production images. **GitHub Actions** handles Continuous Integration.

| Workflow | Trigger | Description |
| :--- | :--- | :--- |
|`main.yml` | Push/PR to `main`, `develop` | Runs `lint`, `build`, `test:cov`, and performs a `Docker Build Check`

The production container is run using the command: `npm run start:prod` (`node dist/infrastructure/http/main.js`)

### Docker Commands

```bash
docker run -d -p 3000:3000 \
    -e NODE_ENV=production \
    -e DB_HOST=host.docker.internal \
    # ... other environment variables
    chimera-backend:latest
```

## 6. Contributing Guidelines

1. Feature Development: All new features must start with a **feature/**`<desc>` branch off of develop.

2. Pull Requests (**PRs**): PRs must target **develop** and include:

    * A descriptible title and summary.
    * Links to any associated issues.
    * All tests passing (npm run test:cov).

3. Review Process: All PRs require at least one approval before merge into `develop` branch. Merges to `main` branch require successful **release/*** branch and two approvals.

### **Welcome aboard the Chimera project!**
