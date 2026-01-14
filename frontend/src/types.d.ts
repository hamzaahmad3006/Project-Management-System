// ====== Global Types For Toast======
declare global {
    interface Window {
        toastify: (msg: string, type?: "success" | "info" | "error" | "warning") => void;
    }
}
// === Loader Props in Component Folder ===
export interface LoaderProps {
    size?: number;
    color?: "primary" | "secondary" | "inherit";
}

//==== Common Types ======
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

//==== InputField Props Interface ====== 
export interface InputFieldProps {
    label?: string;
    type?: string;
    name: string;
    id?: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    icon?: React.ReactNode;
    labelClassName?: string;
    min?: string;
    max?: string;
}

// ===== All Modals Props ====== 
export interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialStatus?: TaskStatus;
    initialProjectId?: string;
}

//==== TaskCard.tsx Interface ====== 
export interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

//==== SearchModalProps Interface ====== 
export interface RecentItem {
    id: string;
    title: string;
    subtitle: string;
    date: string;
    avatar?: string;
}

//==== TaskModalProps Interface ====== 
export interface TeamMember {
    id: string;
    name: string;
    email?: string;
    role?: string;
    avatar?: string;
    _count?: { assignedTasks: number };
}

export type MemberListItem = TeamMember | User | { user: User | TeamMember };

//==== SubtaskModal Props Interface ====== 
export interface AddSubtaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    taskId: string;
}

//==== Theme Props Interface ====== 
export interface ThemeState {
    theme: ThemeType;
}

//==== TeamModal Props Interface ====== 
export interface TeamFile {
    id: string;
    name: string;
    type: 'pdf' | 'image' | 'ppt';
    size: string;
    date: string;
    author: {
        name: string;
        avatar: string;
    };
    url: string;
}

export interface TeamState {
    members: TeamMember[];
    allTeams: Team[];
    stats: TeamStatsData | null;
    files: TeamFile[];
    loading: boolean;
    error: string | null;
}

const initialState: TeamState = {
    members: [],
    allTeams: [],
    stats: null,
    files: [],
    loading: false,
    error: null,
};

// ====== SettingsModalProps Interface ====== 
export interface UserProfile {
    name: string;
    role: string;
    email: string;
    avatar: string;
    team?: string;
}




//===== TemplateGalleryModal.tsx Interface ======
export interface TemplateGalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectTemplate: (templateName: string) => void;
}

//===== CreateTeamModal.tsx Interface ======
export interface User {
    id: string;
    name: string;
    email: string;
    role: "MEMBER" | "MANAGER";
    avatar?: string;
    teamMemberships?: { team: { name: string } }[];
    hasPassword?: boolean;
    hasSeenWelcome: boolean;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    allUsers: User[];
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password?: string;
    role?: "MEMBER" | "MANAGER";
}

export interface GoogleAuthData {
    email?: string | null;
    name?: string | null;
    photoURL?: string | null;
}

export interface AuthResponse {
    user: User & { hasSeenWelcome: boolean };
    token: string;
    message?: string;
}

//===== Project.tsx Interface ======

export interface Task {
    id: string;
    name: string;
    description?: string;
    project?: { id: string; name: string };
    projectId?: string;
    budget?: number;
    assignedToId?: string;
    assigneeId?: string; // For creation payload
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string | null;
    label?: string[];
    assignedTo?: { id: string, name: string, avatar?: string };
    assignee?: { name: string, avatar: string };
    comments?: number;
    attachments?: number;
    createdAt?: string;
    comments_list?: Comment[];
    subtasks?: Subtask[];
}

export interface Comment {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    taskId: string;
    author: {
        id: string;
        name: string;
        avatar?: string;
    };
    attachments?: string[];
}

export interface Subtask {
    id: string;
    title: string;
    completed: boolean;
    taskId: string;
}

export interface Section {
    id: string;
    title: string;
    count: number;
    color: string;
    tasks: Task[];
}

//===== Home.tsx Interface ======
export interface DashboardTask {
    id: string;
    name: string;
    project?: { name: string };
    status: string;
    priority: string;
    dueDate?: string;
    budget?: number;
    createdAt?: string;
    updatedAt?: string;
    subtasks?: Subtask[];
}

//===== Notification.tsx Popover Props Interface ======
export interface NotificationPopoverProps {
    isOpen: boolean;
    onClose: () => void;
    leftOffset?: number;
}

//===== Budget.tsx Interface ======
export interface BudgetOverview {
    totalBudget: number;
    totalSpent: number;
    remaining: number;
}

export interface BudgetProject {
    id: string;
    name: string;
    budget: number;
    spent: number;
    status: string;
}

export interface BudgetState {
    overview: BudgetOverview | null;
    projects: BudgetProject[];
    loading: boolean;
    error: string | null;
}

export interface UpdateBudgetData {
    budget?: number;
    spent?: number;
}

//===== Calendar.tsx Interface ======
export type EventType = 'MEETING' | 'DEADLINE' | 'EVENT';

export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    type: 'MEETING' | 'DEADLINE' | 'EVENT';
    startTime: string;
    endTime: string;
    projectId?: string;
    attendees: User[];
}

export interface CreateCalendarEventData {
    title: string;
    description?: string;
    type: EventType;
    startTime: string;
    endTime: string;
    projectId?: string;
    attendees: string[];
}

export interface CalendarState {
    events: CalendarEvent[];
    loading: boolean;
    error: string | null;
}

//===== Comment.tsx Interface ======
export interface CommentState {
    comments: Comment[];
    loading: boolean;
    error: string | null;
}

//===== SearchModal.tsx Interface ======
export interface SearchResultItem {
    id: string;
    title: string;
    subtitle: string;
    type: 'project' | 'task';
    date: string;
    avatar?: string;
    original: Project | Task;
}

export interface ProfileSettingsProps {
    profile: UserProfile;
    onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: () => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSave: () => Promise<void>;
    onCancel: () => void;
    preview: string | null;
    loading: boolean;
    onDeleteAccount: () => void;
}

//===== Notification.tsx Interface ======
export interface NotificationData {
    teamId?: string;
    teamName?: string;
    token?: string;
    invitedBy?: string;
    addedBy?: string;
    senderAvatar?: string;
    taskId?: string;
    commentId?: string;
    commenterName?: string;
    commenterAvatar?: string;
    timestamp?: Date | string;
}

export interface Notification {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    data: NotificationData | null;
    isRead: boolean;
    createdAt: string;
}

export interface NotificationState {
    notifications: Notification[];
    loading: boolean;
    error: string | null;
}

//===== Project.tsx Interface ======
export interface Project {
    id: string;
    name: string;
    description?: string;
    status: string;
    progress: number;
    startDate: string;
    endDate: string;
    budget: number;
    spent: number;
    manager: { id: string; name: string };
    priority?: string;
    teamId?: string;
    tasks?: { status: string }[];
    team?: {
        id: string;
        name: string;
        members: {
            user: {
                id: string;
                name: string;
                avatar?: string;
            }
        }[];
    };
    _count?: { tasks: number };
}

export interface Team {
    id: string;
    name: string;
}

export interface TeamStat {
    title: string;
    value: string | number;
    meta: string;
}

export interface TeamMemberStat {
    id: string;
    name: string;
    avatar?: string;
    role: string;
    completedTasks: number;
}

export interface TeamProjectStat {
    id: string;
    name: string;
    spent: number;
    completedTasks: number;
}

export interface TeamStatsData {
    stats: TeamStat[];
    topMembers: TeamMemberStat[];
    topProjects: TeamProjectStat[];
    overview: {
        totalSpent: string;
        chartData: { month: string; value: number }[];
    };
}

export interface ProjectState {
    projects: Project[];
    currentProject: Project | null;
    selectedProjectId: string;
    loading: boolean;
    error: string | null;
}

export interface CreateProjectData {
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
    budget?: number;
    priority?: string;
    teamId?: string;
    members?: string[];
}

export interface UpdateProjectData {
    name?: string;
    description?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    budget?: number;
    priority?: string;
}

//===== TaskSlice.ts Interface ======
export interface TaskState {
    tasks: Task[];
    currentTask: Task | null;
    loading: boolean;
    error: string | null;
}

//===== Dashboard related Interface ======
export interface ChartPoint {
    label: string;
    value: number;
    month?: string;
}

export interface DashboardKPIs {
    tasks: {
        total: number;
        completed: number;
        inProgress: number;
        canceled: number;
        overdue: number;
    };
    projects: {
        active: number;
        totalBudget: number;
        totalSpent: number;
    };
    chartData: ChartPoint[];
    initialSpend: number;
}

export interface DashboardState {
    kpis: DashboardKPIs | null;
    recentActivity: DashboardTask[];
    loading: boolean;
    error: string | null;
}