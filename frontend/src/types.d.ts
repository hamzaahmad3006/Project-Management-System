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

//===== Project.tsx Interface ======
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
    id: string;
    name: string;
    description?: string;
    project?: any;
    projectId?: string;
    assignedToId?: string;
    assigneeId?: string; // For creation payload
    subtasks?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string | null;
    label?: string[];
    assignedTo?: { id: string, name: string, avatar?: string };
    assignee?: { name: string, avatar: string };
    comments?: number;
    attachments?: number;
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
}

//===== Notification.tsx Popover Props Interface ======
export interface NotificationPopoverProps {
    isOpen: boolean;
    onClose: () => void;
    leftOffset?: number;
}