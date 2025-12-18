import React from 'react';
import { useCreateProject } from '../../utils/Hooks/ModalHooks';
import TemplateGalleryModal from './TemplateGalleryModal';
import { FaTimes, FaMagic, FaChevronDown } from 'react-icons/fa';
import { CreateModalProps } from '../../types';


const CreateProjectModal: React.FC<CreateModalProps> = ({ isOpen, onClose }) => {
    const {
        allTeams,
        isGalleryOpen,
        setIsGalleryOpen,
        selectedTemplate,
        handleTemplateSelect,
        name,
        setName,
        description,
        setDescription,
        teamId,
        setTeamId,
        isLoading,
        handleCreate
    } = useCreateProject(onClose);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1a1c23] rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden animate-fade-in-up border border-transparent dark:border-gray-800">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Create new project</h3>
                    <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <FaTimes size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {/* Project Name */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project name</label>
                        <input
                            type="text"
                            placeholder="e.g. Website Redesign"
                            className="w-full px-3 py-2 border border-blue-400 dark:border-blue-500/50 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-shadow"
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Template */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Template</label>
                        <div
                            onClick={() => setIsGalleryOpen(true)}
                            className="flex items-center justify-between px-3 py-2 border border-gray-200 dark:border-gray-700 border-dashed rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-blue-300 dark:hover:border-blue-500 transition-colors group"
                        >
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                <FaMagic size={14} />
                                <span className={`text-sm ${selectedTemplate ? 'font-medium text-gray-800 dark:text-gray-100' : ''}`}>
                                    {selectedTemplate || 'Select templates from library'}
                                </span>
                            </div>
                            <FaChevronDown size={12} className="text-gray-400 dark:text-gray-500" />
                        </div>
                    </div>

                    {/* Team & Privacy Row */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Team */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select a team</label>
                            <div className="relative">
                                <select
                                    value={teamId}
                                    onChange={(e) => setTeamId(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md appearance-none focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200"
                                >
                                    <option value="">No Team</option>
                                    {allTeams?.map((team) => (
                                        <option key={team.id} value={team.id}>
                                            {team.name}
                                        </option>
                                    ))}
                                </select>
                                <FaChevronDown size={12} className="absolute right-3 top-3 text-gray-400 dark:text-gray-500 pointer-events-none" />
                            </div>
                        </div>

                        {/* Privacy */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Privacy</label>
                            <div className="relative">
                                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md appearance-none focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200">
                                    <option>Shared with team</option>
                                    <option>Private to me</option>
                                    <option>Public</option>
                                </select>
                                <FaChevronDown size={12} className="absolute right-3 top-3 text-gray-400 dark:text-gray-500 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea
                            rows={3}
                            placeholder="Please share your main reason..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm resize-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                        <button
                            onClick={handleCreate}
                            disabled={isLoading || !name.trim()}
                            className="px-5 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating...' : 'Create project'}
                        </button>
                        <button onClick={onClose} className="px-5 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                            Cancel
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-[#12141c] border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                        Learn more about projects by watching <a href="#" className="text-blue-500 dark:text-blue-400 hover:underline">tutorial video</a>.
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
