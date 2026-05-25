# TaskFlow API Documentation

Base URL:

```txt
/api/v1
```

## Auth APIs

### Register

```http
POST /auth/register
```

Request:

```json
{
  "email": "kai@example.com",
  "password": "Password123!",
  "name": "Kai"
}
```

Response:

```json
{
  "id": "user_id",
  "email": "kai@example.com",
  "name": "Kai"
}
```

### Login

```http
POST /auth/login
```

Request:

```json
{
  "email": "kai@example.com",
  "password": "Password123!"
}
```

Response:

```json
{
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

### Refresh Token

```http
POST /auth/refresh
```

### Get Current User

```http
GET /auth/me
```

### Logout

```http
POST /auth/logout
```

## User APIs

### Get Profile

```http
GET /users/me
```

### Update Profile

```http
PATCH /users/me
```

Request:

```json
{
  "name": "Kai Dev",
  "avatarUrl": "https://example.com/avatar.png"
}
```

## Workspace APIs

### Create Workspace

```http
POST /workspaces
```

Request:

```json
{
  "name": "TaskFlow Team",
  "description": "Workspace for TaskFlow project"
}
```

### Get My Workspaces

```http
GET /workspaces
```

### Get Workspace Detail

```http
GET /workspaces/:workspaceId
```

### Update Workspace

```http
PATCH /workspaces/:workspaceId
```

### Delete Workspace

```http
DELETE /workspaces/:workspaceId
```

Soft delete workspace by setting `deletedAt`.

## Workspace Member APIs

### Get Members

```http
GET /workspaces/:workspaceId/members
```

### Update Member Role

```http
PATCH /workspaces/:workspaceId/members/:memberId/role
```

Request:

```json
{
  "role": "ADMIN"
}
```

### Remove Member

```http
DELETE /workspaces/:workspaceId/members/:memberId
```

## Invitation APIs

### Invite Member

```http
POST /workspaces/:workspaceId/invitations
```

Request:

```json
{
  "email": "member@example.com",
  "role": "MEMBER"
}
```

### Accept Invitation

```http
POST /invitations/accept
```

Request:

```json
{
  "token": "invitation_token"
}
```

### Cancel Invitation

```http
POST /workspaces/:workspaceId/invitations/:invitationId/cancel
```

## Project APIs

### Create Project

```http
POST /workspaces/:workspaceId/projects
```

Request:

```json
{
  "name": "TaskFlow Backend",
  "key": "TFBE",
  "description": "Backend service for TaskFlow"
}
```

### Get Projects

```http
GET /workspaces/:workspaceId/projects?page=1&limit=10&search=backend&status=ACTIVE
```

### Get Project Detail

```http
GET /projects/:projectId
```

### Update Project

```http
PATCH /projects/:projectId
```

### Archive Project

```http
PATCH /projects/:projectId/archive
```

### Delete Project

```http
DELETE /projects/:projectId
```

## Task APIs

### Create Task

```http
POST /projects/:projectId/tasks
```

Request:

```json
{
  "title": "Create auth module",
  "description": "Implement register, login, refresh token",
  "priority": "HIGH",
  "status": "TODO",
  "assigneeId": "user_id",
  "dueDate": "2026-06-01T10:00:00.000Z"
}
```

### Get Tasks

```http
GET /projects/:projectId/tasks?page=1&limit=20&status=TODO&priority=HIGH&assigneeId=user_id
```

### Get Task Detail

```http
GET /tasks/:taskId
```

### Update Task

```http
PATCH /tasks/:taskId
```

### Change Task Status

```http
PATCH /tasks/:taskId/status
```

Request:

```json
{
  "status": "IN_PROGRESS"
}
```

### Assign Task

```http
PATCH /tasks/:taskId/assignee
```

Request:

```json
{
  "assigneeId": "user_id"
}
```

### Reorder Tasks

```http
PATCH /projects/:projectId/tasks/reorder
```

Request:

```json
{
  "tasks": [
    {
      "id": "task_1",
      "status": "TODO",
      "position": 1
    },
    {
      "id": "task_2",
      "status": "IN_PROGRESS",
      "position": 1
    }
  ]
}
```

### Delete Task

```http
DELETE /tasks/:taskId
```

## Comment APIs

### Create Comment

```http
POST /tasks/:taskId/comments
```

Request:

```json
{
  "content": "This task is ready for review."
}
```

### Get Comments

```http
GET /tasks/:taskId/comments
```

### Update Comment

```http
PATCH /comments/:commentId
```

### Delete Comment

```http
DELETE /comments/:commentId
```

## Activity APIs

### Get Task Activities

```http
GET /tasks/:taskId/activities
```

Example activity:

```json
{
  "action": "TASK_STATUS_CHANGED",
  "metadata": {
    "from": "TODO",
    "to": "IN_PROGRESS"
  }
}
```

## Notification APIs

### Get Notifications

```http
GET /notifications?page=1&limit=20&isRead=false
```

### Mark Notification As Read

```http
PATCH /notifications/:notificationId/read
```

### Mark All As Read

```http
PATCH /notifications/read-all
```

## File APIs

### Upload File

```http
POST /files/upload
```

Content-Type:

```txt
multipart/form-data
```

### Attach File To Task

```http
POST /tasks/:taskId/files
```

Request:

```json
{
  "fileId": "file_id"
}
```

## Standard Response Format

Success:

```json
{
  "success": true,
  "data": {},
  "message": "Success"
}
```

Error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

Pagination:

```json
{
  "items": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```
