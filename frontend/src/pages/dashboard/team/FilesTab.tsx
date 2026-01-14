import React, { useEffect } from 'react';
import { FaFilePdf, FaFileImage, FaFilePowerpoint, FaEllipsisH } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchTeamFiles } from '../../../store/slices/teamSlice';

const FilesTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const { teamId } = useOutletContext<{ teamId: string }>();
  const { files, loading } = useAppSelector((state) => state.team);

  useEffect(() => {
    if (teamId) {
      dispatch(fetchTeamFiles(teamId));
    }
  }, [dispatch, teamId]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FaFilePdf className="text-red-500 text-xl" />;
      case 'image':
        return <FaFileImage className="text-emerald-500 text-xl" />;
      case 'ppt':
        return <FaFilePowerpoint className="text-blue-500 text-xl" />;
      default:
        return <FaFilePdf className="text-gray-500 text-xl" />;
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading files...</div>;
  }

  return (
    <div className="w-full bg-white dark:bg-[#1a1c23] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr_auto] gap-4 px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        <div>Name</div>
        <div>size</div>
        <div>date upload</div>
        <div>Auther</div>
        <div className="w-8"></div>
      </div>

      <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
        {files.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-400">
            No files found for this team.
          </div>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              className="grid grid-cols-[2fr_1fr_1fr_1.5fr_auto] gap-4 px-6 py-4 items-center hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group cursor-pointer"
              onClick={() => window.open(file.url, '_blank')}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                  {getFileIcon(file.type)}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate pr-2">
                  {file.name}
                </span>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">2.3 MB</div>

              <div className="text-sm text-gray-500 dark:text-gray-400">{file.date}</div>

              <div className="flex items-center gap-2">
                <img
                  src={file.author.avatar || `https://ui-avatars.com/api/?name=${file.author.name}`}
                  alt={file.author.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">{file.author.name}</span>
              </div>

              <div className="flex justify-end">
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100">
                  <FaEllipsisH />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FilesTab;
