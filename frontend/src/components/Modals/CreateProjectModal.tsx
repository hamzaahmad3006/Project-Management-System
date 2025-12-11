import React, { useState } from 'react';
import TemplateGalleryModal from './TemplateGalleryModal';
import { FaTimes, FaMagic, FaChevronDown } from 'react-icons/fa';

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    const handleTemplateSelect = (template: string) => {
        setSelectedTemplate(template);
        setIsGalleryOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">Create new project</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <FaTimes size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {/* Project Name */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">Project name</label>
                        <input
                            type="text"
                            placeholder="e.g. Website Redesign"
                            className="w-full px-3 py-2 border border-blue-400 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow"
                            autoFocus
                        />
                    </div>

                    {/* Template */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">Template</label>
                        <div
                            onClick={() => setIsGalleryOpen(true)}
                            className="flex items-center justify-between px-3 py-2 border border-gray-200 border-dashed rounded-md cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-colors group"
                        >
                            <div className="flex items-center gap-2 text-gray-600 group-hover:text-blue-600">
                                <FaMagic size={14} />
                                <span className={`text-sm ${selectedTemplate ? 'font-medium text-gray-800' : ''}`}>
                                    {selectedTemplate || 'Select templates from library'}
                                </span>
                            </div>
                            <FaChevronDown size={12} className="text-gray-400" />
                        </div>
                    </div>

                    {/* Team & Privacy Row */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Team */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700">Select a team</label>
                            <div className="relative">
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500 bg-white text-sm text-gray-700">
                                    <option>Design team</option>
                                    <option>Development team</option>
                                    <option>Marketing team</option>
                                </select>
                                <FaChevronDown size={12} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Privacy */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700">Privacy</label>
                            <div className="relative">
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500 bg-white text-sm text-gray-700">
                                    <option>Shared with team</option>
                                    <option>Private to me</option>
                                    <option>Public</option>
                                </select>
                                <FaChevronDown size={12} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            rows={3}
                            placeholder="Please share your main reason..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 resize-none text-sm"
                        ></textarea>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                        <button className="px-5 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors shadow-sm">
                            Create project
                        </button>
                        <button onClick={onClose} className="px-5 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <p className="text-xs text-center text-gray-500">
                        Learn more about projects by watching <a href="#" className="text-blue-500 hover:underline">tutorial video</a>.
                    </p>
                </div>
            </div>
            {/* Template Gallery */}
            <TemplateGalleryModal
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                onSelectTemplate={handleTemplateSelect}
            />
        </div>
    );
};

export default CreateProjectModal;
