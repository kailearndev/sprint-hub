# sprint-hub Roles & Permissions

## Roles

sprint-hub uses workspace-level roles.

```txt
OWNER
ADMIN
MEMBER
VIEWER
```

## Role Meaning

### OWNER

The creator or highest-level manager of a workspace.

Can:

- Manage workspace settings
- Delete workspace
- Invite members
- Remove members
- Change member roles
- Manage projects
- Manage tasks
- View all data in workspace

### ADMIN

A manager role for operating the workspace.

Can:

- Update workspace
- Invite members
- Remove members except OWNER
- Manage projects
- Manage tasks
- View all data in workspace

Cannot:

- Delete workspace
- Remove OWNER
- Change OWNER role

### MEMBER

A normal contributor.

Can:

- View workspace
- View projects
- Create tasks
- Update tasks
- Comment on tasks
- Upload task files

Cannot:

- Manage workspace settings
- Invite members
- Remove members
- Create or archive projects

### VIEWER

Read-only role.

Can:

- View workspace
- View projects
- View tasks
- View comments

Cannot:

- Create, update, or delete data

## Permission Matrix

| Resource | Action | OWNER | ADMIN | MEMBER | VIEWER |
|---|---|---:|---:|---:|---:|
| Workspace | View | Yes | Yes | Yes | Yes |
| Workspace | Update | Yes | Yes | No | No |
| Workspace | Delete | Yes | No | No | No |
| Member | View | Yes | Yes | Yes | Yes |
| Member | Invite | Yes | Yes | No | No |
| Member | Remove | Yes | Yes | No | No |
| Member | Change Role | Yes | No | No | No |
| Project | View | Yes | Yes | Yes | Yes |
| Project | Create | Yes | Yes | No | No |
| Project | Update | Yes | Yes | No | No |
| Project | Archive | Yes | Yes | No | No |
| Project | Delete | Yes | No | No | No |
| Task | View | Yes | Yes | Yes | Yes |
| Task | Create | Yes | Yes | Yes | No |
| Task | Update | Yes | Yes | Yes | No |
| Task | Delete | Yes | Yes | No | No |
| Comment | View | Yes | Yes | Yes | Yes |
| Comment | Create | Yes | Yes | Yes | No |
| Comment | Update Own | Yes | Yes | Yes | No |
| Comment | Delete Own | Yes | Yes | Yes | No |
| Notification | View Own | Yes | Yes | Yes | Yes |

## Backend Guard Idea

Use a custom decorator and guard.

```ts
@RequireWorkspaceRole(WorkspaceRole.OWNER, WorkspaceRole.ADMIN)
@Post(':workspaceId/projects')
createProject() {}
```

## Permission Flow

```txt
Request comes in
-> JWT Guard validates user
-> WorkspaceRoleGuard checks workspaceId
-> Load WorkspaceMember by userId + workspaceId
-> Check role against required roles
-> Allow or reject request
```

## Recommended Error Codes

```txt
401 Unauthorized: Missing or invalid token
403 Forbidden: User does not have permission
404 Not Found: Resource does not exist or user cannot access it
409 Conflict: Duplicate resource or invalid state
```
