# Contributing to Chimera Backend

Welcome to the Chimera proejct! We are committed to maintaining a high-quality, scalable backend service.

## 1. Local Setup

Refer to the [Archtecture Overview](https://github.com/chimeraorg/chimera-backend/wiki/Archtecture-Overview) and the [README.md](README.md) for environment setup and running migrations.

## 2. Git Workflow

We use a simplified GitFlw model. **All contributions must be made via Pull Requests.**

1. **Start from `main`:**
  ```bash
  git checkout main
  git pull origin main
  ```
2. **Create a Feature Branch:**
  ```bash
      git checkout -b feature/your-descriptive-feature-name
  ```

3. **Commit Messages:** Use **Conventional Commits** standard:
  - `feat`: New feature (e.g., `feat(auth): Add refresh token flow`)
  - `fix`: Bug fix (e.g., `fix(users): Corret profile update DTO`)
  - `chore`: Maintenance config changes (e.g., `chore(deps): Update NestJS to 10.2`)
  - `test`: Adding/refactoring tests (e.g., `test(auth): Cover edge cases in LoginUseCase`)

## 3. Pull Request Guidelines
  - **Target Branch:** Always target the `main` branch (unless instructed otherwise).
  - **Quality Gates:** Your PR will require passing CI checks (Lint, Build, Tests) and receiving **at leat two** approving reviews from code owners.
  - **Self-Review:** Before requesting a review, ensure the [pull_request_template.md](.github/pull_request_template.md) checklist is complete.

 ## 4. Code Standards
  - **TypeScript:** Strict mode is enforced. Avoid using `any` unless absolutely necessary (and justified).
  - **Clean Architecture:** Ensure separation of concerns. Domain should not import Infrastructure.
  - **Testing:** New logic must have dedicated unit tests. Run `npm run test:cov` locally before pushing.
