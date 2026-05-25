# sprint-hub Feature Specification

## Product Goal

sprint-hub helps teams manage workspaces, projects, and tasks using a Kanban-style workflow. This project is designed as a fullstack learning project with real-world architecture.

## Feature List

## 1. Authentication

### Features

- Register account
- Login
- Logout
- Refresh token
- Get current user
- Password hashing
- JWT access token
- Refresh token rotation

### Acceptance Criteria

- User can create an account.
- User can login with email and password.
- Password is stored as a hash.
- Protected APIs require access token.
- Refresh token can generate new access token.

## 2. Workspace Management

### Features

- Create workspace
- Update workspace
- Delete workspace
- List my workspaces
- Get workspace detail

### Acceptance Criteria

- A user who creates a workspace becomes OWNER.
- Deleted workspace uses soft delete.
- User only sees workspaces they belong to.

## 3. Member & Permission

### Roles

```txt
OWNER
ADMIN
MEMBER
VIEWER
```

### Permission Summary

| Action | OWNER | ADMIN | MEMBER | VIEWER |
|---|---:|---:|---:|---:|
| View workspace | Yes | Yes | Yes | Yes |
| Update workspace | Yes | Yes | No | No |
| Delete workspace | Yes | No | No | No |
| Invite member | Yes | Yes | No | No |
| Remove member | Yes | Yes | No | No |
| Create project | Yes | Yes | No | No |
| Update project | Yes | Yes | No | No |
| Create task | Yes | Yes | Yes | No |
| Update task | Yes | Yes | Yes | No |
| Comment task | Yes | Yes | Yes | No |
| View task | Yes | Yes | Yes | Yes |

### Acceptance Criteria

- Viewer cannot mutate data.
- Member can manage tasks but cannot manage workspace settings.
- Admin can manage projects and members.
- Owner has full access.

## 4. Invitation

### Features

- Invite member by email
- Accept invitation by token
- Cancel invitation
- Expire invitation

### Acceptance Criteria

- Invitation has status PENDING by default.
- Invitation token must be unique.
- Expired token cannot be accepted.
- Accepting invitation creates WorkspaceMember.

## 5. Project Management

### Features

- Create project
- Update project
- Archive project
- Delete project
- Search projects
- Filter by status

### Acceptance Criteria

- Project belongs to one workspace.
- Project key is unique inside workspace.
- Archived project is read-only or hidden from active views.

## 6. Task Management

### Features

- Create task
- Update task
- Delete task
- Assign task
- Change status
- Change priority
- Set due date
- Reorder tasks
- Filter tasks
- Search tasks

### Statuses

```txt
TODO
IN_PROGRESS
IN_REVIEW
DONE
CANCELED
```

### Priorities

```txt
LOW
MEDIUM
HIGH
URGENT
```

### Acceptance Criteria

- Task belongs to one project.
- Task can have one assignee.
- Task can be moved between Kanban columns.
- Task position is persisted after drag and drop.
- Deleting task uses soft delete.

## 7. Kanban Board

### Features

- Show columns by status
- Drag task between columns
- Drag task inside same column
- Persist task order

### Frontend Library

```txt
@dnd-kit
```

### Acceptance Criteria

- Moving a task updates `status` and `position`.
- UI updates optimistically.
- Failed update rolls back UI state.

## 8. Comments

### Features

- Add comment
- Edit comment
- Delete comment
- List comments by task

### Acceptance Criteria

- Only comment author, Admin, or Owner can edit/delete comment.
- Deleted comment uses soft delete.

## 9. Activity Log

### Features

- Log task created
- Log task updated
- Log status changed
- Log assignee changed
- Log comment created

### Example Actions

```txt
TASK_CREATED
TASK_UPDATED
TASK_STATUS_CHANGED
TASK_ASSIGNEE_CHANGED
COMMENT_CREATED
```

### Acceptance Criteria

- Important task changes create activity logs.
- Activity logs are append-only.
- Activity logs are visible in task detail.

## 10. Notification

### Features

- Notify when assigned to task
- Notify when task is updated
- Notify when comment is created
- Mark as read
- Mark all as read
- Real-time notification

### Acceptance Criteria

- User receives notification when assigned.
- Notification can be marked as read.
- Real-time event is emitted through Socket.IO.

## 11. File Upload

### Features

- Upload file
- Attach file to task
- Show file list in task detail

### Acceptance Criteria

- File has URL, name, mimeType, and size.
- File can be linked to a task.

## 12. Dashboard

### Features

- Total projects
- Total tasks
- Tasks by status
- My assigned tasks
- Upcoming due tasks

### Acceptance Criteria

- Dashboard only shows data user can access.
- Dashboard supports loading and empty states.

## MVP Scope

Build these first:

1. Auth
2. Workspace
3. WorkspaceMember
4. Project
5. Task
6. Kanban board
7. Role guard
8. Soft delete

## Nice-to-have Later

- Stripe subscription
- Email verification
- Forgot password
- Team analytics
- Public project sharing
- Webhook integration
- GitHub integration
