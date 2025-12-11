import React, { useEffect } from 'react';
import { FaSearch, FaCheckCircle, FaUser, FaSortAmountDown, FaCalendarAlt } from 'react-icons/fa';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface RecentItem {
    id: string;
    title: string;
    subtitle: string;
    date: string;
    avatar?: string;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
    // Close on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const recentItems: RecentItem[] = [
        {
            id: '1',
            title: 'Contact customers with failed new ayents or who churned',
            subtitle: 'Dev/Directions',
            date: '2 days ago',
            avatar: 'https://i.pravatar.cc/150?u=1'
        },
        {
            id: '2',
            title: 'Reporting: Design concept of visual dashboard',
            subtitle: 'Marketing',
            date: '2 days ago',
            avatar: 'https://i.pravatar.cc/150?u=2'
        },
        {
            id: '3',
            title: 'Task detail modal: ideas',
            subtitle: 'Dev / Directions',
            date: '2 days ago',
            avatar: 'https://i.pravatar.cc/150?u=3'
        },
        {
            id: '4',
            title: 'Add Projects to templates and layouts [draft 2025]',
            subtitle: 'Landing [empty]',
            date: '2 days ago'
        },
        {
            id: '5',
            title: 'Reporting: Design concept of visual dashboard',
            subtitle: 'QA progress',
            date: '2 days ago',
            avatar: 'https://i.pravatar.cc/150?u=5'
        },
        {
            id: '6',
            title: 'Help Docs: update screenshot',
            subtitle: 'Design drafts',
            date: '2 days ago'
        },
        {
            id: '7',
            title: 'Reporting: Design concept of visual dashboard',
            subtitle: 'Dev/Directions',
            date: '2 days ago',
            avatar: 'https://i.pravatar.cc/150?u=7'
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            ></div>

            {/* Modal */}
            <div
                className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in slide-in-from-top-4 duration-200"
            >
                {/* Search Input Header */}
                <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                    <FaSearch className="text-gray-400 text-lg" />
                    <input
                        type="text"
                        placeholder="Search, run a command or ask a question..."
                        className="flex-1 text-lg text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                        autoFocus
                    />
                </div>

                {/* Filters */}
                <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-2 overflow-x-auto no-scrollbar bg-gray-50/50">
                    <FilterButton icon={<FaSortAmountDown />} label="Sort" />
                    <FilterButton icon={<FaUser />} label="Created by: Yauhen Rymaszewski" active />
                    <FilterButton icon={<FaCheckCircle />} label="Projects" />
                    <FilterButton icon={<FaCalendarAlt />} label="Date" />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-2">
                    <div className="px-2 py-2 text-xs font-semibold text-gray-500 uppercase">Recent</div>
                    <div className="space-y-0.5">
                        {recentItems.map((item) => (
                            <div key={item.id} className="group flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                                <div className="flex-shrink-0 text-gray-400 group-hover:text-blue-500">
                                    <FaCheckCircle size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-900 truncate">{item.title}</div>
                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                        <span>{item.subtitle}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span>{item.date}</span>
                                    </div>
                                </div>
                                {item.avatar && (
                                    <img src={item.avatar} alt="User" className="w-6 h-6 rounded-full border border-gray-200" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-2 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] shadow-sm">↵</kbd>
                        <span>Select</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] shadow-sm">Ctrl</kbd>
                        <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] shadow-sm">↵</kbd>
                        <span>Open</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FilterButton: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
    <button className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded border transition-all whitespace-nowrap
        ${active
            ? 'bg-blue-50 text-blue-600 border-blue-200'
            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

export default SearchModal;
