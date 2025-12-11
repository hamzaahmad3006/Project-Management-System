import React, { useState } from 'react';
import { FaSearch, FaStar, FaRocket, FaPencilRuler, FaGraduationCap, FaBullhorn, FaCode, FaUsers, FaLaptopHouse, FaBriefcase, FaRegLightbulb, FaTimes } from 'react-icons/fa';

interface TemplateGalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectTemplate: (templateName: string) => void;
}

const TemplateGalleryModal: React.FC<TemplateGalleryModalProps> = ({ isOpen, onClose, onSelectTemplate }) => {
    const [selectedCategory, setSelectedCategory] = useState('Development');
    const [searchQuery, setSearchQuery] = useState('');

    if (!isOpen) return null;

    const categories = [
        { id: 'my_templates', name: 'My templates', icon: FaStar },
        { id: 'productivity', name: 'Productivity', icon: FaRocket },
        { id: 'design', name: 'Design', icon: FaPencilRuler, color: 'text-orange-500' },
        { id: 'education', name: 'Education', icon: FaSearch },
        { id: 'marketing', name: 'Marketing', icon: FaBullhorn },
        { id: 'development', name: 'Development', icon: FaCode, color: 'text-red-500' },
        { id: 'hr', name: 'HR & Operations', icon: FaUsers },
        { id: 'remote', name: 'Remote work', icon: FaLaptopHouse },
        { id: 'sales', name: 'Sales', icon: FaBriefcase },
    ];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[80vh] flex overflow-hidden animate-fade-in-up relative">
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
                    <FaTimes size={18} />
                </button>

                {/* Sidebar */}
                <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
                    <div className="p-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <FaSearch className="absolute left-3 top-2.5 text-gray-400" size={14} />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
                        {categories.map(cat => (
                            <div
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors
                                    ${selectedCategory === cat.name ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                <cat.icon className={cat.color || 'text-gray-500'} size={14} />
                                {cat.name}
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-gray-500 hover:text-gray-700 cursor-pointer text-sm">
                            <FaRegLightbulb size={14} />
                            Suggest a template
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    {/* Header */}
                    <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                                <FaRocket className="text-red-500" size={20} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Development</h2>
                        </div>
                        <button
                            onClick={() => onSelectTemplate('Development')}
                            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow-sm transition-colors"
                        >
                            Use Template
                        </button>
                    </div>

                    {/* Description & Preview */}
                    <div className="flex-1 overflow-y-auto p-8">
                        <p className="text-gray-600 text-sm leading-relaxed max-w-3xl mb-8">
                            This template supports tech teams with task tracking, sprint planning, and issue management, enabling agile workflows and efficient collaboration across development phases.
                        </p>

                        {/* Preview Image Placeholder (replicating the board look) */}
                        <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-inner">
                            {/* Fake Toolbar */}
                            <div className="flex items-center gap-4 mb-4 border-b border-gray-200 pb-2">
                                <div className="w-24 h-2 bg-gray-200 rounded"></div>
                                <div className="w-32 h-2 bg-gray-200 rounded"></div>
                            </div>
                            {/* Fake Table */}
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-4 h-4 border border-gray-300 rounded"></div>
                                        <div className="flex-1 h-3 bg-gray-200 rounded"></div>
                                        <div className="w-20 h-3 bg-gray-100 rounded"></div>
                                        <div className="w-24 h-3 bg-gray-100 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateGalleryModal;
