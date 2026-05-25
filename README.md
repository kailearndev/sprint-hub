# TaskFlow

TaskFlow is a project management SaaS inspired by Trello, Jira, and ClickUp. The goal of this project is to learn fullstack development through a realistic product with authentication, workspace management, role-based permissions, task tracking, real-time notifications, and deployment.

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zustand
- React Hook Form
- Zod

### Backend

- NestJS
- Prisma
- PostgreSQL
- JWT Authentication
- Refresh Token
- Socket.IO
- Redis
- Docker

## Main Features

- Authentication
- Workspace management
- Project management
- Kanban board
- Task management
- Member invitation
- Role-based access control
- Task comments
- Activity logs
- Real-time notifications
- File upload
- Soft delete
- Pagination, search, filter, sort

## Project Structure

```txt
taskflow/
├── taskflow-fe/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   └── types/
│
├── taskflow-be/
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── workspaces/
│   │   ├── projects/
│   │   ├── tasks/
│   │   ├── comments/
│   │   ├── notifications/
│   │   └── common/
│   └── prisma/
│
└── docs/
    ├── database.md
    ├── api.md
    ├── features.md
    └── roles-permissions.md
```

## Development Roadmap

### Phase 1: Foundation

- Setup frontend project
- Setup backend project
- Setup PostgreSQL and Prisma
- Setup environment variables
- Setup Docker Compose

### Phase 2: Authentication

- Register
- Login
- Refresh token
- Get current user
- Logout
- Password hashing
- JWT guards

### Phase 3: Workspace & Project

- Workspace CRUD
- Member management
- Invite member
- Project CRUD
- Archive project

### Phase 4: Task Management

- Task CRUD
- Assign user
- Change status
- Priority
- Due date
- Comments
- Activity log

### Phase 5: Real-time Features

- Socket.IO gateway
- Notification system
- Mark notification as read
- Task update events

### Phase 6: Production

- Dockerize frontend
- Dockerize backend
- CI/CD
- VPS deploy
- Nginx reverse proxy

## Suggested Repository Names

```txt
taskflow-fe
taskflow-be
```

## Suggested Domain

```txt
taskflow.kai.dev
app.taskflow.kai.dev
```
