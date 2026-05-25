# sprint-hub Database Design

This document describes the database schema for sprint-hub.

## Database

- Database: PostgreSQL
- ORM: Prisma
- Soft delete strategy: `deletedAt` timestamp
- ID strategy: UUID / CUID
- Timestamp fields: `createdAt`, `updatedAt`

## Entity Overview

```txt
User
Workspace
WorkspaceMember
Invitation
Project
Task
TaskComment
TaskActivity
Notification
RefreshToken
File
```

## Enums

```prisma
enum UserStatus {
  ACTIVE
  INACTIVE
  BANNED
}

enum WorkspaceRole {
  OWNER
  ADMIN
  MEMBER
  VIEWER
}

enum ProjectStatus {
  ACTIVE
  ARCHIVED
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  IN_REVIEW
  DONE
  CANCELED
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum InvitationStatus {
  PENDING
  ACCEPTED
  EXPIRED
  CANCELED
}

enum NotificationType {
  TASK_ASSIGNED
  TASK_UPDATED
  COMMENT_CREATED
  MEMBER_INVITED
  PROJECT_UPDATED
}
```

## Prisma Schema Draft

```prisma
model User {
  id            String            @id @default(cuid())
  email         String            @unique
  password      String
  name          String?
  avatarUrl     String?
  status        UserStatus        @default(ACTIVE)

  workspaceMembers WorkspaceMember[]
  assignedTasks     Task[]         @relation("TaskAssignee")
  createdTasks      Task[]         @relation("TaskCreator")
  comments          TaskComment[]
  activities        TaskActivity[]
  notifications     Notification[]
  refreshTokens     RefreshToken[]

  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt
  deletedAt     DateTime?
}

model Workspace {
  id          String            @id @default(cuid())
  name        String
  slug        String            @unique
  description String?
  logoUrl     String?

  members     WorkspaceMember[]
  projects    Project[]
  invitations Invitation[]

  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
  deletedAt   DateTime?
}

model WorkspaceMember {
  id          String        @id @default(cuid())
  userId      String
  workspaceId String
  role        WorkspaceRole @default(MEMBER)

  user        User          @relation(fields: [userId], references: [id])
  workspace   Workspace     @relation(fields: [workspaceId], references: [id])

  joinedAt    DateTime      @default(now())
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@unique([userId, workspaceId])
  @@index([workspaceId])
}

model Invitation {
  id          String           @id @default(cuid())
  email       String
  token       String           @unique
  status      InvitationStatus @default(PENDING)
  role        WorkspaceRole    @default(MEMBER)
  workspaceId String
  invitedById String
  expiredAt   DateTime

  workspace   Workspace        @relation(fields: [workspaceId], references: [id])

  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  @@index([workspaceId])
  @@index([email])
}

model Project {
  id          String        @id @default(cuid())
  name        String
  key         String
  description String?
  status      ProjectStatus @default(ACTIVE)
  workspaceId String

  workspace   Workspace     @relation(fields: [workspaceId], references: [id])
  tasks       Task[]

  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  deletedAt   DateTime?

  @@unique([workspaceId, key])
  @@index([workspaceId])
}

model Task {
  id          String       @id @default(cuid())
  title       String
  description String?
  status      TaskStatus   @default(TODO)
  priority    TaskPriority @default(MEDIUM)
  position    Int          @default(0)
  dueDate     DateTime?

  projectId   String
  creatorId   String
  assigneeId  String?

  project     Project      @relation(fields: [projectId], references: [id])
  creator     User         @relation("TaskCreator", fields: [creatorId], references: [id])
  assignee    User?        @relation("TaskAssignee", fields: [assigneeId], references: [id])

  comments    TaskComment[]
  activities  TaskActivity[]
  files       File[]

  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  deletedAt   DateTime?

  @@index([projectId])
  @@index([assigneeId])
  @@index([status])
}

model TaskComment {
  id        String   @id @default(cuid())
  content   String
  taskId    String
  userId    String

  task      Task     @relation(fields: [taskId], references: [id])
  user      User     @relation(fields: [userId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([taskId])
}

model TaskActivity {
  id        String   @id @default(cuid())
  action    String
  metadata  Json?
  taskId    String
  userId    String

  task      Task     @relation(fields: [taskId], references: [id])
  user      User     @relation(fields: [userId], references: [id])

  createdAt DateTime @default(now())

  @@index([taskId])
}

model Notification {
  id        String           @id @default(cuid())
  type      NotificationType
  title     String
  message   String?
  isRead    Boolean          @default(false)
  userId    String
  metadata  Json?

  user      User             @relation(fields: [userId], references: [id])

  createdAt DateTime         @default(now())
  readAt     DateTime?

  @@index([userId])
  @@index([isRead])
}

model RefreshToken {
  id        String   @id @default(cuid())
  tokenHash String
  userId    String
  userAgent String?
  ipAddress String?
  expiredAt DateTime
  revokedAt DateTime?

  user      User     @relation(fields: [userId], references: [id])

  createdAt DateTime @default(now())

  @@index([userId])
}

model File {
  id        String   @id @default(cuid())
  url       String
  name      String
  mimeType  String
  size      Int
  taskId    String?

  task      Task?    @relation(fields: [taskId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Relationships

```txt
User 1 - N WorkspaceMember
Workspace 1 - N WorkspaceMember
Workspace 1 - N Project
Project 1 - N Task
Task 1 - N TaskComment
Task 1 - N TaskActivity
User 1 - N Notification
User 1 - N RefreshToken
Task 1 - N File
```

## Soft Delete Rules

Use `deletedAt` instead of hard deleting important business records.

Recommended soft delete models:

- User
- Workspace
- Project
- Task
- TaskComment

Do not soft delete:

- RefreshToken
- Notification
- TaskActivity

## Indexing Strategy

Recommended indexes:

- `User.email`
- `Workspace.slug`
- `WorkspaceMember.workspaceId`
- `WorkspaceMember.userId`
- `Project.workspaceId`
- `Task.projectId`
- `Task.assigneeId`
- `Task.status`
- `Notification.userId`
- `Notification.isRead`

## Notes

- `WorkspaceMember` handles many-to-many relation between users and workspaces.
- `Project.key` can be used for task codes later, for example `TF-12`.
- `Task.position` is used for Kanban drag and drop ordering.
- `TaskActivity.metadata` stores flexible audit details.
