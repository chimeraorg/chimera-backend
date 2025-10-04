---
name: Feature Request
about: Suggest an idea or request a new functional requirement.
title: 'feat(module): brief description of the feature'
labels: ['enhancement', 'triage']
---

### Problem/Motivation

_Describe the problem this new feature solves or the business goal it address (e.g., "Users need to update their passwords to comply with security standards.")._

## Proposed Solution (Technical)

_Outline the proposed a architecture or approach._
- **Boundary Context:** [Which module will be affected: `auth`, `notifications,` new module?]
- **API Endopoint:** [e.g., `PATCH /users/password`]
- **Data Model Changes:** [e.g., New column `password_changed_at` on `User` entity]

## Acceptance Criteria

- [ ] User can successfully perform the action.
- [ ] All related Use Cases are covered by unit tests.
- [ ] Security checks are implemented (e.g., Authorization Guard).
