import React from 'react';
import { useCreateProject } from './useCreateProject';
import TemplateGalleryModal from '../templateGalleryModal/TemplateGalleryModal';
import { FaTimes, FaMagic, FaChevronDown, FaProjectDiagram } from 'react-icons/fa';
import { CreateModalProps } from 'types';
import { ButtonLoader } from 'components/loader/Loader';
import InputForm from 'components/ui/inputFields/InputForm';
import SelectField from 'components/ui/inputFields/SelectedForm';
import TextAreaForm from 'components/ui/inputFields/TextAreaForm';
import ButtonForm from 'components/ui/buttons/ButtonForm';


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
        budget,
        setBudget,
        isLoading,
        handleCreate
    } = useCreateProject(onClose);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1a1c23] rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden animate-fade-in-up border border-transparent dark:border-gray-800">

                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Create new project</h3>
                    <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <FaTimes size={16} />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    <div className="space-y-1.5">
                        <InputForm
                            label="Project name"
                            name="projectName"
                            placeholder="e.g. Website Redesign"
                            value={name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            className="text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-1 focus:ring-blue-500 border-blue-400 dark:border-blue-500/50"
                            labelClassName="text-gray-700 dark:text-gray-300"

                        />
                    </div>

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


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <div className="space-y-1.5">
                            <SelectField
                                label="Select a team"
                                name="team"
                                value={teamId}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTeamId(e.target.value)}
                                options={[
                                    { label: "No Team", value: "" },
                                    ...(allTeams || []).map(team => ({ label: team.name, value: team.id }))
                                ]}
                                placeholder="Select Team"
                                icon={<FaChevronDown size={12} />}
                                className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                                labelClassName="text-gray-700 dark:text-gray-300"
                            />
                        </div>


                        <div className="space-y-1.5">
                            <SelectField
                                label="Privacy"
                                name="privacy"
                                value="Shared with team"
                                options={[
                                    { label: "Shared with team", value: "Shared with team" },
                                    { label: "Private to me", value: "Private to me" },
                                    { label: "Public", value: "Public" }
                                ]}
                                placeholder="Select Privacy"
                                icon={<FaChevronDown size={12} />}
                                className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                                labelClassName="text-gray-700 dark:text-gray-300"
                            />
                        </div>


                        <div className="space-y-1.5">
                            <InputForm
                                label="Budget ($)"
                                name="budget"
                                type="number"
                                placeholder="0"
                                value={budget}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBudget(parseFloat(e.target.value))}
                                className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                                labelClassName="text-gray-700 dark:text-gray-300"
                            />
                        </div>
                    </div>


                    <div className="space-y-1.5">
                        <TextAreaForm
                            label="Description"
                            name="description"
                            rows={3}
                            placeholder="Please share your main reason..."
                            value={description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                            className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                            labelClassName="text-gray-700 dark:text-gray-300"
                        />
                    </div>


                    <div className="flex items-center gap-3 pt-2">
                        <ButtonForm
                            onClick={handleCreate}
                            disabled={isLoading || !name.trim()}
                            label={isLoading ? <ButtonLoader /> : 'Create project'}
                            variant="primary"
                            size="md"
                            className="px-5 py-2"
                        />
                        <ButtonForm
                            onClick={onClose}
                            label="Cancel"
                            variant="secondary"
                            size="md"
                            className="px-5 py-2"
                        />
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 dark:bg-[#12141c] border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                        Learn more about projects by watching <a href="#" className="text-blue-500 dark:text-blue-400 hover:underline">tutorial video</a>.
                    </p>
                </div>
            </div>
            <TemplateGalleryModal
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                onSelectTemplate={handleTemplateSelect}
            />
        </div>
    );
};

export default CreateProjectModal;
