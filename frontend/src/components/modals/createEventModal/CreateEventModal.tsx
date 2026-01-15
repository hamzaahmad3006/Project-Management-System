import React from 'react';
import { FaTimes, FaCalendarAlt, FaLayerGroup, FaTags, FaClock } from 'react-icons/fa';
import { CreateModalProps, EventType } from 'types';
import { useCreateEvent } from './useCreateEvent';
import { ButtonLoader } from '../../loader/Loader';

const CreateEventModal: React.FC<CreateModalProps> = ({ isOpen, onClose }) => {
  const {
    projects,
    title,
    setTitle,
    description,
    setDescription,
    type,
    setType,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    projectId,
    setProjectId,
    isLoading,
    handleSubmit,
    dateError,
  } = useCreateEvent(onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-[#1a1c23] rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 animate-fade-in-up border border-transparent dark:border-gray-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Schedule New Event</h3>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <form onSubmit={(e: React.FormEvent) => handleSubmit(e)} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="e.g. Weekly Sync"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Start Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setStartTime(e.target.value)
                  }
                  min={new Date().toISOString().slice(0, 16)}
                  className={`w-full pl-8 pr-3 py-2.5 border rounded-lg focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm [color-scheme:light] dark:[color-scheme:dark] ${dateError ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
                  required
                />
                <FaClock
                  className="absolute left-2.5 top-3.5 text-gray-400 dark:text-gray-500"
                  size={14}
                />
              </div>
              {dateError && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                  <span>⚠️</span> {dateError}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                End Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndTime(e.target.value)}
                  min={startTime || new Date().toISOString().slice(0, 16)}
                  className="w-full pl-8 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm [color-scheme:light] dark:[color-scheme:dark]"
                  required
                />
                <FaClock
                  className="absolute left-2.5 top-3.5 text-gray-400 dark:text-gray-500"
                  size={14}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Type
              </label>
              <div className="relative">
                <select
                  value={type}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setType(e.target.value as EventType)
                  }
                  className="w-full pl-8 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm appearance-none"
                >
                  <option value="MEETING">Meeting</option>
                  <option value="DEADLINE">Deadline</option>
                  <option value="EVENT">General Event</option>
                </select>
                <FaTags
                  className="absolute left-2.5 top-3.5 text-gray-400 dark:text-gray-500"
                  size={14}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Project (Optional)
              </label>
              <div className="relative">
                <select
                  value={projectId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setProjectId(e.target.value)
                  }
                  className="w-full pl-8 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm appearance-none"
                >
                  <option value="">None</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <FaLayerGroup
                  className="absolute left-2.5 top-3.5 text-gray-400 dark:text-gray-500"
                  size={14}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
              rows={3}
              placeholder="Add details about this event..."
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm resize-none placeholder-gray-400 dark:placeholder-gray-500"
            ></textarea>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-800 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-all transform active:scale-95 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? <ButtonLoader /> : 'Schedule Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
