import React from 'react';
import {
  FaTimes,
  FaUser,
  FaRegFlag,
  FaCalendarAlt,
  FaLayerGroup,
  FaDollarSign,
} from 'react-icons/fa';
import { CreateModalProps, TaskStatus, TaskPriority } from 'types';
import { useCreateTaskHook } from './useCreateTaskHook';
import { ButtonLoader } from 'components/loader/Loader';
import SelectField from 'components/ui/inputFields/SelectedForm';
import InputForm from 'components/ui/inputFields/InputForm';
import TextAreaForm from 'components/ui/inputFields/TextAreaForm';
import ButtonForm from 'components/ui/buttons/ButtonForm';

const CreateGlobalTaskModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  initialStatus,
  initialProjectId,
}) => {
  const {
    projects,
    name,
    setName,
    description,
    setDescription,
    status,
    setStatus,
    priority,
    setPriority,
    dueDate,
    setDueDate,
    assigneeId,
    setAssigneeId,
    projectId,
    setProjectId,
    budget,
    setBudget,
    labels,
    setLabels,
    loading,
    handleSubmit,
    dateError,
  } = useCreateTaskHook(isOpen, onClose, initialStatus, initialProjectId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-[#1a1c23] rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden transform transition-all scale-100 flex flex-col max-h-[90vh] border border-transparent dark:border-gray-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Create New Task</h3>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 custom-scrollbar">
          <form id="create-task-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
              <div className="space-y-1.5">
                <SelectField
                  label="Project"
                  name="project"
                  value={projectId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setProjectId(e.target.value);
                    setAssigneeId('');
                  }}
                  options={[...projects.map((p) => ({ label: p.name, value: p.id }))]}
                  icon={<FaLayerGroup size={12} />}
                  required
                  disabled={loading}
                  className="border-blue-200 dark:border-blue-800/50 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                  labelClassName="text-xs uppercase tracking-wider font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2"
                />
              </div>

              <div className="space-y-1.5">
                <SelectField
                  label="Assignee"
                  name="assignee"
                  value={assigneeId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setAssigneeId(e.target.value)
                  }
                  disabled={!projectId || loading}
                  options={[
                    { label: !projectId ? 'Select a project first...' : 'Unassigned', value: '' },
                    ...(projectId
                      ? (projects.find((p) => p.id === projectId)?.team?.members || []).map(
                        (m: { user: { id: string; name: string } }) => ({
                          label: m.user.name,
                          value: m.user.id,
                        })
                      )
                      : []),
                  ]}
                  icon={<FaUser size={12} />}
                  className="border-blue-200 dark:border-blue-800/50 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                  labelClassName="text-xs uppercase tracking-wider font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <InputForm
                label="Task Name"
                name="taskName"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                placeholder="What needs to be done?"
                required
                disabled={loading}
                className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium placeholder-gray-400 dark:placeholder-gray-500"
                labelClassName="block text-sm font-semibold text-gray-700 dark:text-gray-300"
              />
            </div>

            <div className="space-y-1.5">
              <TextAreaForm
                label="Description"
                name="description"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setDescription(e.target.value)
                }
                rows={4}
                placeholder="Add more details..."
                disabled={loading}
                className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                labelClassName="block text-sm font-medium text-gray-700 dark:text-gray-300"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <SelectField
                  label="Board Status"
                  name="status"
                  value={status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setStatus(e.target.value as TaskStatus)
                  }
                  options={[
                    { label: 'Backlog (To Do)', value: 'TODO' },
                    { label: 'In Progress', value: 'IN_PROGRESS' },
                    { label: 'QA (Completed)', value: 'COMPLETED' },
                    { label: 'Postpone (Canceled)', value: 'CANCELED' },
                  ]}
                  disabled={loading}
                  className="border-blue-100 dark:border-blue-900/30 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                  labelClassName="block text-xs font-semibold text-blue-600 dark:text-blue-400"
                />
              </div>

              <div className="space-y-1.5">
                <SelectField
                  label="Priority"
                  name="priority"
                  value={priority}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setPriority(e.target.value as TaskPriority)
                  }
                  options={[
                    { label: 'Low', value: 'LOW' },
                    { label: 'Medium', value: 'MEDIUM' },
                    { label: 'High', value: 'HIGH' },
                  ]}
                  icon={
                    <FaRegFlag
                      size={12}
                      className={`${priority === 'HIGH' ? 'text-red-500' : priority === 'MEDIUM' ? 'text-yellow-500' : 'text-blue-500'}`}
                    />
                  }
                  disabled={loading}
                  className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                  labelClassName="block text-xs font-semibold text-gray-500 dark:text-gray-400"
                />
              </div>

              <div className="space-y-1.5">
                <InputForm
                  label="Due Date"
                  name="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDueDate(e.target.value)}
                  icon={<FaCalendarAlt size={12} />}
                  disabled={loading}
                  className={`border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 [color-scheme:light] dark:[color-scheme:dark] ${dateError ? 'border-red-500 dark:border-red-500' : ''}`}
                  labelClassName="block text-xs font-semibold text-gray-500 dark:text-gray-400"
                  min={new Date().toISOString().split('T')[0]}
                />
                {dateError && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                    <span>⚠️</span> {dateError}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <InputForm
                  label="Task Price ($)"
                  name="budget"
                  type="number"
                  value={budget}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBudget(e.target.value)}
                  placeholder="0.00"
                  icon={<FaDollarSign size={12} />}
                  disabled={loading}
                  className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                  labelClassName="block text-xs font-semibold text-gray-500 dark:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Labels
              </label>
              <div className="flex flex-wrap gap-2">
                {['Design', 'Development', 'Marketing', 'Bug', 'Feature', 'Urgent'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setLabels((prev) =>
                        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                      );
                    }}
                    className={`px-3 py-1.5 text-xs rounded-full border ${labels.includes(tag)
                      ? 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-700 font-semibold'
                      : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700'
                      } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-300 dark:hover:border-gray-600'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
          <ButtonForm
            label="Cancel"
            onClick={onClose}
            disabled={loading}
            variant="secondary"
            size="md"
            className="px-5 py-2 font-medium"
          />
          <ButtonForm
            label={loading ? <ButtonLoader /> : 'Create Task'}
            onClick={() =>
              document
                .getElementById('create-task-form')
                ?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
            }
            disabled={loading}
            variant="primary"
            size="md"
            className="px-6 py-2 font-bold shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default CreateGlobalTaskModal;
