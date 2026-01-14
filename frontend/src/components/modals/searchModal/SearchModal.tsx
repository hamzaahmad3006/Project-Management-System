import React from 'react';
import {
  FaSearch,
  FaCheckCircle,
  FaSortAmountDown,
  FaCalendarAlt,
  FaProjectDiagram,
} from 'react-icons/fa';
import { CreateModalProps } from 'types';
import { useSearch } from './useSearch';

const SearchModal: React.FC<CreateModalProps> = ({ isOpen, onClose }) => {
  const { searchTerm, setSearchTerm, searchResults, isLoading, handleSelect } = useSearch(
    isOpen,
    onClose
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      ></div>

      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1a1c23] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in slide-in-from-top-4 duration-200 border border-gray-100 dark:border-gray-800">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <FaSearch
            className={`transition-colors duration-200 ${isLoading ? 'text-blue-500 animate-pulse' : 'text-gray-400 dark:text-gray-500'}`}
          />
          <input
            type="text"
            placeholder="Search projects or tasks..."
            className="flex-1 text-lg text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder:text-gray-600 outline-none bg-transparent"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>

        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2 overflow-x-auto no-scrollbar bg-gray-50/50 dark:bg-gray-800/10">
          <FilterButton icon={<FaSortAmountDown />} label="Sort" />
          <FilterButton icon={<FaProjectDiagram />} label="Projects" />
          <FilterButton icon={<FaCheckCircle />} label="Tasks" />
          <FilterButton icon={<FaCalendarAlt />} label="Date" />
        </div>

        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar min-h-[200px]">
          {searchTerm.trim() ? (
            <>
              <div className="px-3 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.1em] flex justify-between items-center">
                <span>
                  {searchResults.length > 0
                    ? `Results (${searchResults.length})`
                    : 'No results found'}
                </span>
                {isLoading && (
                  <span className="animate-spin h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full"></span>
                )}
              </div>
              <div className="space-y-0.5">
                {searchResults.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    onClick={() => handleSelect(item)}
                    className="group flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/30 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex-shrink-0 text-gray-400 dark:text-gray-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                      {item.type === 'project' ? (
                        <FaProjectDiagram size={16} />
                      ) : (
                        <FaCheckCircle size={16} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1.5 mt-0.5">
                        <span className="font-semibold">{item.subtitle}</span>
                        <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></span>
                        <span className="uppercase text-[10px] tracking-wider">
                          {item.date?.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    {item.avatar && (
                      <img
                        src={item.avatar}
                        alt="User"
                        className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700"
                      />
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-8 text-center mt-10">
              <FaSearch className="mx-auto text-4xl text-gray-200 dark:text-gray-800 mb-4" />
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Type to search for projects or tasks
              </p>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/20 flex items-center justify-end gap-6 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-sm text-gray-900 dark:text-gray-100">
              ↵
            </kbd>
            <span>Select</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterButton: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({
  icon,
  label,
  active,
}) => (
  <button
    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-full border transition-all whitespace-nowrap tracking-tight
        ${
          active
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/50 shadow-sm shadow-blue-500/10'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600'
        }`}
  >
    <span className="text-gray-400 dark:text-gray-500 group-hover:text-inherit">{icon}</span>
    <span>{label}</span>
  </button>
);

export default SearchModal;
