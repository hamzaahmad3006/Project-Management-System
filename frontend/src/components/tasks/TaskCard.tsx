import React from 'react';
import { FaEdit, FaTrash, FaUserCircle } from 'react-icons/fa';
import { TaskCardProps, TaskPriority, TaskStatus } from 'types';

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
    const priorityColors: Record<TaskPriority, string> = {
        LOW: 'bg-green-100 text-green-800',
        MEDIUM: 'bg-yellow-100 text-yellow-800',
        HIGH: 'bg-red-100 text-red-800',
    };

    const statusColors: Record<TaskStatus, string> = {
        TODO: 'bg-gray-100 text-gray-800',
        IN_PROGRESS: 'bg-blue-100 text-blue-800',
        COMPLETED: 'bg-green-100 text-green-800',
        CANCELED: 'bg-red-100 text-red-800',
    };

    return (
        <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-800 truncate flex-1">{task.name}</h3>
                <div className="flex gap-2 ml-2">
                    <button onClick={() => onEdit(task)} className="text-gray-400 hover:text-indigo-600">
                        <FaEdit />
                    </button>
                    <button onClick={() => onDelete(task.id)} className="text-gray-400 hover:text-red-600">
                        <FaTrash />
                    </button>
                </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>

            <div className="flex items-center justify-between mt-auto">
                <div className="flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[task.priority]}`}>
                        {task.priority}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[task.status]}`}>
                        {task.status.replace('_', ' ')}
                    </span>
                </div>

                {task.assignedTo && (
                    <div className="flex items-center gap-1" title={task.assignedTo.name}>
                        {task.assignedTo.avatar ? (
                            <img src={task.assignedTo.avatar} alt="" className="w-6 h-6 rounded-full" />
                        ) : (
                            <FaUserCircle className="text-gray-400 w-6 h-6" />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskCard;
