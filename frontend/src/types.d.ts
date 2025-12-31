// Loader Props in Component Folder
export interface LoaderProps {
    size?: number;
    color?: "primary" | "secondary" | "inherit";
}

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
}

// ===== All Modals Props ====== 
export interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
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
}


// ====== SettingsModalProps Interface ====== 
export interface UserProfile {
    name: string;
    role: string;
    email: string;
    avatar: string;
}

export interface ProfileSettingsProps {
    profile: UserProfile;
    setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
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
    user: User;
    token: string;
    message?: string;
}

//===== Project.tsx Interface ======
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

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

//===== Notification.tsx Interface ======
export interface Notification {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    data: Record<string, any> | null;
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