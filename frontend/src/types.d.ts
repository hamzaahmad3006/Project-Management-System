// ====== SettingsModalProps Interface ====== 
export interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

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

//===== Project.tsx Interface ======
export interface Task {
    id: string;
    name: string;
    project?: string;
    subtasks?: string;
    status: string;
    priority?: string;
    dueDate?: string;
    label?: string[];
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
