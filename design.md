# sprint-hub Frontend Design Specification

## 1. Mục tiêu giao diện

Thiết kế frontend cho `sprint-hub`: ứng dụng quản lý workspace, project và task theo Kanban workflow. Giao diện cần mềm mại, hiện đại, dễ scan, tập trung vào thao tác hằng ngày của team thay vì cảm giác landing page.

Frontend nên được gen theo hướng app dashboard thực tế:

- Dùng Tailwind CSS.
- Bo góc mềm, spacing thoáng, màu sắc tinh tế.
- Ưu tiên trải nghiệm quản lý công việc nhanh: tìm kiếm, lọc, drag/drop task, xem chi tiết task, comment, activity log.
- Không làm hero marketing hoặc landing page. Màn hình đầu tiên sau đăng nhập là dashboard/workspace app shell.
- Responsive tốt cho desktop, tablet, mobile.

## 2. Product Context

`sprint-hub` giúp team quản lý:

- Workspace
- Thành viên và phân quyền
- Project
- Task
- Kanban board
- Comment
- Activity log
- Notification
- File đính kèm

MVP cần ưu tiên:

1. Authentication
2. Workspace
3. WorkspaceMember
4. Project
5. Task
6. Kanban board
7. Role-based UI
8. Soft delete/archive states

## 3. Design Language

### Tính cách giao diện

- Hiện đại, sạch, mềm, chuyên nghiệp.
- Tập trung vào productivity dashboard, không trang trí quá đà.
- Giao diện nên có chiều sâu nhẹ bằng border, shadow rất mềm, background phân lớp.
- Không dùng gradient tím/xanh tím làm chủ đạo toàn app.
- Không dùng palette một màu. Cần phối neutral + xanh lá/teal + amber/red cho trạng thái.
- Không dùng card lồng card.
- Không dùng section floating card nếu không cần. App shell nên rõ ràng, chắc chắn.

### Tailwind Theme Gợi Ý

```ts
colors: {
  background: "#F7F8FA",
  surface: "#FFFFFF",
  surfaceMuted: "#F1F5F4",
  border: "#E2E8E6",
  text: "#17211F",
  textMuted: "#66736F",
  primary: "#0F766E",
  primaryHover: "#115E59",
  primarySoft: "#CCFBF1",
  accent: "#F59E0B",
  danger: "#DC2626",
  success: "#16A34A",
  info: "#2563EB"
}
```

### Visual Tokens

- Page background: `bg-[#F7F8FA]`
- Main surface: `bg-white`
- Muted surface: `bg-[#F1F5F4]`
- Border: `border-[#E2E8E6]`
- Text primary: `text-[#17211F]`
- Text secondary: `text-[#66736F]`
- Primary action: teal `#0F766E`
- Border radius:
  - Buttons/input: `rounded-lg`
  - Cards/panels: `rounded-xl`
  - Modals/drawers: `rounded-2xl`
- Shadow:
  - Default panel: `shadow-sm`
  - Floating menu/modal: `shadow-xl shadow-slate-200/60`
- Spacing:
  - App shell gap: `gap-4` hoặc `gap-6`
  - Panel padding: `p-4`, `p-5`, `p-6`
  - Dense table/list padding: `px-4 py-3`

### Typography

- Font: Inter, Geist, hoặc system sans-serif.
- Không scale font theo viewport width.
- Heading app:
  - Page title: `text-2xl font-semibold`
  - Section title: `text-base font-semibold`
  - Card title: `text-sm font-medium`
- Body:
  - Default: `text-sm`
  - Meta/helper: `text-xs text-muted`
- Letter spacing giữ mặc định, không dùng tracking âm.

## 4. App Shell

### Desktop Layout

App sau đăng nhập dùng layout 3 vùng:

- Left sidebar cố định: workspace switcher, navigation.
- Top bar: search, create button, notification, user menu.
- Main content: dashboard/project/board/settings.

```txt
┌───────────────┬────────────────────────────────────────────┐
│ Sidebar       │ Topbar                                     │
│               ├────────────────────────────────────────────┤
│ Navigation    │ Main content                               │
│               │                                            │
└───────────────┴────────────────────────────────────────────┘
```

Sidebar:

- Width desktop: `w-64`
- Background: white hoặc very light muted.
- Border right.
- Workspace switcher ở trên cùng.
- Navigation items có icon + label.
- Active item dùng teal soft background.

Topbar:

- Height: `h-16`
- Border bottom.
- Search input ở trái hoặc giữa.
- Action cluster ở phải: notification, invite/create, user avatar.

Main:

- `p-6`
- Max width chỉ dùng cho settings/forms. Board cần full available width.

### Mobile Layout

- Sidebar chuyển thành drawer.
- Topbar có menu icon.
- Board Kanban cho phép horizontal scroll.
- Filters collapse thành sheet/dropdown.
- Task detail mở dạng full-screen drawer.

## 5. Navigation Structure

### Public Routes

- `/login`
- `/register`
- `/invitations/accept?token=...`

### Protected Routes

- `/app`
- `/app/workspaces`
- `/app/workspaces/:workspaceId/dashboard`
- `/app/workspaces/:workspaceId/projects`
- `/app/workspaces/:workspaceId/projects/:projectId/board`
- `/app/workspaces/:workspaceId/projects/:projectId/tasks`
- `/app/workspaces/:workspaceId/members`
- `/app/workspaces/:workspaceId/invitations`
- `/app/workspaces/:workspaceId/settings`
- `/app/notifications`
- `/app/profile`

### Sidebar Items

- Dashboard
- Projects
- My Tasks
- Members
- Invitations
- Notifications
- Workspace Settings

Ẩn hoặc disable item theo role:

- `VIEWER`: chỉ xem dashboard, projects, board, tasks, comments, notifications.
- `MEMBER`: thêm tạo/cập nhật task, comment, upload file.
- `ADMIN`: thêm members, invitations, projects, workspace settings.
- `OWNER`: toàn quyền, có delete workspace/project.

## 6. Core Screens

### 6.1 Login

Mục tiêu: đăng nhập nhanh, rõ ràng.

Layout:

- Centered auth panel, max width `420px`.
- Background muted nhẹ.
- Brand `sprint-hub` rõ ràng.
- Form gồm email, password, submit.
- Link sang register.

Components:

- Email input
- Password input có show/hide icon
- Primary button
- Error alert
- Loading state

Copy gợi ý:

- Title: `Welcome back`
- Subtitle: `Sign in to continue to sprint-hub.`
- Button: `Sign in`

### 6.2 Register

Form:

- Name
- Email
- Password
- Confirm password nếu frontend cần validate

State:

- Validate password client-side.
- Show error từ API.
- Sau register có thể redirect login hoặc app.

### 6.3 Workspace List / Switcher

Hiển thị danh sách workspace user thuộc về.

Elements:

- Workspace cards/list rows.
- Search workspace.
- Create workspace button.
- Empty state khi chưa có workspace.

Workspace item:

- Logo/initials
- Name
- Description
- User role badge
- Project/task summary nếu có data

Create workspace modal:

- Name
- Description
- Submit/cancel

### 6.4 Dashboard

Dashboard chỉ hiển thị data user được quyền xem.

Sections:

- Metric row:
  - Total projects
  - Total tasks
  - My assigned tasks
  - Upcoming due tasks
- Tasks by status chart hoặc compact status summary.
- My assigned tasks list.
- Upcoming due tasks list.
- Recent activity.

Design:

- Dùng panel mềm, không card lồng nhau.
- Metric cards `rounded-xl border bg-white p-4`.
- Status colors nhất quán với Kanban.
- Loading skeleton cho metric và list.
- Empty state thân thiện khi chưa có project/task.

### 6.5 Project List

Features:

- Create project
- Search projects
- Filter by status: `ACTIVE`, `ARCHIVED`
- Archive project
- Delete project theo quyền

Layout:

- Header: title, search, status filter, create button.
- Project list dạng table hoặc grid compact.

Project item:

- Project name
- Project key
- Description
- Status badge
- Task count by status
- Updated date
- More actions menu

Permission:

- OWNER/ADMIN: create/update/archive project.
- OWNER: delete project.
- MEMBER/VIEWER: chỉ xem.

### 6.6 Kanban Board

Đây là màn hình quan trọng nhất.

Library:

- Dùng `@dnd-kit` cho drag and drop.

Columns:

- `TODO`
- `IN_PROGRESS`
- `IN_REVIEW`
- `DONE`
- `CANCELED`

Column design:

- Background muted.
- Header sticky trong column.
- Header có label, count, optional add button.
- Width desktop: khoảng `320px`.
- Horizontal scroll khi không đủ rộng.
- Mỗi column giữ kích thước ổn định, không bị layout shift khi drag.

Task card:

- Title
- Priority badge
- Assignee avatar/name
- Due date
- Comment/file indicators
- Task code nếu có project key
- Subtle hover state
- Click mở task detail drawer

Task status colors:

- TODO: slate/neutral
- IN_PROGRESS: blue
- IN_REVIEW: amber
- DONE: green
- CANCELED: red/gray

Priority colors:

- LOW: gray
- MEDIUM: blue
- HIGH: amber
- URGENT: red

Interactions:

- Drag task giữa columns cập nhật `status` và `position`.
- Drag trong cùng column cập nhật `position`.
- Optimistic UI.
- Nếu API lỗi, rollback và show toast.
- `VIEWER` không được drag/drop.

Board toolbar:

- Project selector hoặc breadcrumb.
- Search task.
- Filter status.
- Filter priority.
- Filter assignee.
- Create task button nếu role cho phép.

### 6.7 Task List

Ngoài board, cần list/table view để lọc nhanh.

Columns:

- Task title
- Status
- Priority
- Assignee
- Due date
- Updated date
- Actions

Filters:

- Search
- Status
- Priority
- Assignee

Empty states:

- No tasks
- No matching filters

### 6.8 Task Create/Edit Modal

Fields:

- Title
- Description
- Status
- Priority
- Assignee
- Due date

Rules:

- Title required.
- Priority default `MEDIUM`.
- Status default `TODO`.
- Assignee optional.

Role:

- OWNER/ADMIN/MEMBER có thể create/update task.
- VIEWER disable form hoặc không thấy action.

### 6.9 Task Detail Drawer

Mở từ board/list. Drawer bên phải trên desktop, full-screen trên mobile.

Sections:

- Header:
  - Task title
  - Status select
  - Priority select
  - More actions
- Meta:
  - Assignee
  - Creator
  - Due date
  - Project
- Description editor/viewer
- Files
- Comments
- Activity log

Comments:

- List comments theo thời gian.
- Add comment box.
- Edit/delete comment nếu là author, ADMIN hoặc OWNER.
- VIEWER chỉ xem.

Activity log:

- Hiển thị action:
  - `TASK_CREATED`
  - `TASK_UPDATED`
  - `TASK_STATUS_CHANGED`
  - `TASK_ASSIGNEE_CHANGED`
  - `COMMENT_CREATED`
- Metadata hiển thị dạng dễ đọc: `moved from TODO to IN_PROGRESS`.

Files:

- Upload file
- Attach file to task
- File row gồm icon, name, mime type, size

### 6.10 Members

Features:

- List members
- Invite member
- Update member role
- Remove member

Member table:

- Avatar
- Name/email
- Role badge
- Joined date
- Actions

Role controls:

- OWNER có thể đổi role.
- ADMIN có thể remove member nhưng không remove OWNER, không đổi OWNER role.
- MEMBER/VIEWER chỉ xem danh sách.

Invite modal:

- Email
- Role: `ADMIN`, `MEMBER`, `VIEWER`
- Submit

### 6.11 Invitations

Features:

- List pending invitations.
- Cancel invitation.
- Accept invitation bằng token.

Invitation row:

- Email
- Role
- Status
- Expired at
- Invited by
- Actions

Status badges:

- PENDING: amber
- ACCEPTED: green
- EXPIRED: gray
- CANCELED: red/gray

### 6.12 Notifications

Features:

- List notifications
- Filter unread
- Mark as read
- Mark all as read
- Real-time update qua Socket.IO sau này

Notification types:

- `TASK_ASSIGNED`
- `TASK_UPDATED`
- `COMMENT_CREATED`
- `MEMBER_INVITED`
- `PROJECT_UPDATED`

Design:

- Bell icon ở topbar có unread dot/count.
- Notification dropdown cho quick view.
- Full page `/app/notifications` cho quản lý chi tiết.

### 6.13 Workspace Settings

Fields:

- Workspace name
- Description
- Logo URL/upload nếu có

Danger zone:

- Delete workspace chỉ OWNER.
- Soft delete bằng `deletedAt`.
- Confirm modal cần nhập tên workspace hoặc xác nhận rõ ràng.

### 6.14 Profile

Fields:

- Name
- Avatar URL
- Email readonly

Actions:

- Update profile
- Logout

## 7. Components

### Buttons

Variants:

- Primary: teal background, white text.
- Secondary: white background, border.
- Ghost: transparent, hover muted.
- Danger: red for destructive actions.
- Icon button: square `h-9 w-9`, lucide icon, tooltip.

States:

- Hover
- Focus ring
- Disabled
- Loading spinner

### Inputs

Use consistent form controls:

- Text input
- Password input
- Textarea
- Select
- Combobox for assignee/project search
- Date picker
- File upload

Style:

- `rounded-lg border bg-white px-3 py-2 text-sm`
- Focus ring teal.
- Error text below field.

### Badges

Role badges:

- OWNER: dark text + strong border
- ADMIN: teal
- MEMBER: blue
- VIEWER: gray

Status badges:

- Project ACTIVE: green
- Project ARCHIVED: gray
- Task statuses theo màu Kanban.

Priority badges:

- LOW gray
- MEDIUM blue
- HIGH amber
- URGENT red

### Tables

- Header sticky nếu list dài.
- Row height ổn định.
- Hover muted.
- Actions trong kebab menu.
- Empty state ở table body.

### Modals & Drawers

- Modal cho create/edit nhỏ.
- Drawer cho task detail.
- Confirm modal cho delete/archive/cancel invite.
- Không đặt modal content thành nhiều card lồng nhau.

### Toasts

Use cases:

- Login failed
- Save success
- Drag/drop rollback
- Invite sent
- Permission denied

Tone:

- Success green
- Error red
- Info blue/teal

### Loading States

- Skeleton cho dashboard metrics, table rows, board cards.
- Button loading khi submit.
- Avoid full-page spinner nếu có thể skeleton.

### Empty States

Empty states cần có action phù hợp quyền:

- No workspace: show create workspace.
- No projects: OWNER/ADMIN thấy create project, role khác thấy message read-only.
- No tasks: OWNER/ADMIN/MEMBER thấy create task.
- No notifications: simple quiet empty message.

## 8. Permission-Based UI Rules

Frontend phải reflect permission, nhưng backend vẫn là nguồn quyền chính.

### OWNER

Show:

- Workspace settings
- Delete workspace
- Invite/remove/change role
- Create/update/archive/delete project
- Create/update/delete task
- Comment/edit/delete own comments
- View all data

### ADMIN

Show:

- Workspace settings update
- Invite/remove members except OWNER
- Create/update/archive projects
- Create/update/delete tasks
- Comments

Hide/disable:

- Delete workspace
- Remove OWNER
- Change OWNER role
- Delete project nếu docs yêu cầu OWNER only

### MEMBER

Show:

- View workspace/projects
- Create/update task
- Comment task
- Upload task files

Hide/disable:

- Workspace settings mutations
- Invite/remove members
- Create/archive projects

### VIEWER

Show:

- Read-only workspace/project/task/comment/notification

Hide/disable:

- Create/update/delete buttons
- Drag/drop board
- Comment box
- Upload controls

## 9. API Integration Notes

Base URL:

```txt
/api/v1
```

Auth:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/me`
- `POST /auth/logout`

User:

- `GET /users/me`
- `PATCH /users/me`

Workspace:

- `POST /workspaces`
- `GET /workspaces`
- `GET /workspaces/:workspaceId`
- `PATCH /workspaces/:workspaceId`
- `DELETE /workspaces/:workspaceId`

Members:

- `GET /workspaces/:workspaceId/members`
- `PATCH /workspaces/:workspaceId/members/:memberId/role`
- `DELETE /workspaces/:workspaceId/members/:memberId`

Invitations:

- `POST /workspaces/:workspaceId/invitations`
- `POST /invitations/accept`
- `POST /workspaces/:workspaceId/invitations/:invitationId/cancel`

Projects:

- `POST /workspaces/:workspaceId/projects`
- `GET /workspaces/:workspaceId/projects?page=1&limit=10&search=backend&status=ACTIVE`
- `GET /projects/:projectId`
- `PATCH /projects/:projectId`
- `PATCH /projects/:projectId/archive`
- `DELETE /projects/:projectId`

Tasks:

- `POST /projects/:projectId/tasks`
- `GET /projects/:projectId/tasks?page=1&limit=20&status=TODO&priority=HIGH&assigneeId=user_id`
- `GET /tasks/:taskId`
- `PATCH /tasks/:taskId`
- `PATCH /tasks/:taskId/status`
- `PATCH /tasks/:taskId/assignee`
- `PATCH /projects/:projectId/tasks/reorder`
- `DELETE /tasks/:taskId`

Comments:

- `POST /tasks/:taskId/comments`
- `GET /tasks/:taskId/comments`
- `PATCH /comments/:commentId`
- `DELETE /comments/:commentId`

Activities:

- `GET /tasks/:taskId/activities`

Notifications:

- `GET /notifications?page=1&limit=20&isRead=false`
- `PATCH /notifications/:notificationId/read`
- `PATCH /notifications/read-all`

Files:

- `POST /files/upload`
- `POST /tasks/:taskId/files`

Standard response:

```json
{
  "success": true,
  "data": {},
  "message": "Success"
}
```

Pagination shape:

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

## 10. Data Models For UI

Frontend nên map trực tiếp các enum:

```ts
type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
type ProjectStatus = "ACTIVE" | "ARCHIVED";
type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE" | "CANCELED";
type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
type InvitationStatus = "PENDING" | "ACCEPTED" | "EXPIRED" | "CANCELED";
type NotificationType =
  | "TASK_ASSIGNED"
  | "TASK_UPDATED"
  | "COMMENT_CREATED"
  | "MEMBER_INVITED"
  | "PROJECT_UPDATED";
```

## 11. UX Behavior Requirements

### Optimistic Updates

Apply optimistic UI for:

- Moving Kanban task.
- Mark notification read.
- Mark all notifications read.
- Updating task status.

Rollback on API failure and show toast.

### Search & Filters

Use query state where practical:

- Project search/status filter.
- Task search/status/priority/assignee.
- Notification unread filter.

Debounce search input around 300ms.

### Error Handling

Recommended error display:

- `401`: redirect login or refresh token flow.
- `403`: show permission denied toast/page.
- `404`: show not found state.
- `409`: show conflict message near form or toast.

### Accessibility

- Keyboard focus visible.
- Buttons have accessible labels.
- Icon-only buttons need `aria-label` and tooltip.
- Modal/drawer traps focus.
- Kanban drag/drop should still provide fallback controls for status change.

## 12. Responsive Requirements

Desktop:

- Full sidebar + topbar.
- Kanban horizontal columns visible with scroll.
- Task detail drawer width `480px` to `640px`.

Tablet:

- Sidebar can collapse.
- Board scroll remains usable.
- Filters can wrap.

Mobile:

- Sidebar as drawer.
- Topbar compact.
- Board columns scroll horizontally.
- Task detail full-screen.
- Tables become stacked rows or horizontally scrollable with clear affordance.

## 13. Suggested Implementation Stack

Nếu gen frontend mới:

- React hoặc Next.js.
- Tailwind CSS.
- `@dnd-kit` cho Kanban.
- `lucide-react` cho icons.
- TanStack Query cho server state.
- React Hook Form + Zod cho forms.
- Zustand hoặc context nhỏ cho auth/workspace state.
- Socket.IO client sau này cho notification real-time.

## 14. Visual QA Checklist

Trước khi coi là hoàn thành:

- Auth pages không bị vỡ trên mobile.
- Sidebar active state rõ.
- Topbar actions không overlap.
- Dashboard metric cards đều height.
- Project table/list có empty/loading/error states.
- Kanban columns có fixed width, scroll tốt, không layout shift khi drag.
- Task card text không tràn khỏi card.
- Task detail drawer không che mất action chính.
- Role-based buttons ẩn/disable đúng.
- Modal form có validation/error/loading.
- Palette không bị một màu, không quá tím/xanh tím.
- Không có card lồng card.
- Text trong button không bị overflow.

## 15. First Screen Recommendation

Sau khi đăng nhập, route mặc định nên là:

```txt
/app/workspaces/:workspaceId/dashboard
```

Nếu user chưa có workspace:

```txt
/app/workspaces
```

Màn hình workspace empty nên có create workspace modal ngay trong flow để user bắt đầu nhanh.
