import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../../store/slices/projectSlice';
import { AppDispatch, RootState } from '../../store/store';
import { FaPlus, FaCalendar, FaMoneyBillWave } from 'react-icons/fa';

const Projects: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { projects, loading } = useSelector((state: RootState) => state.projects);

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-indigo-700">
                    <FaPlus /> New Project
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading projects...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-gray-800">{project.name}</h3>
                                <span className={`px-2 py-1 rounded text-xs font-medium
                  ${project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {project.status}
                                </span>
                            </div>

                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

                            <div className="mb-4">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Progress</span>
                                    <span>{Math.round(project.progress)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${project.progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex justify-between text-sm text-gray-500 pt-4 border-t">
                                <div className="flex items-center gap-1">
                                    <FaCalendar className="text-gray-400" />
                                    <span>{new Date(project.endDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FaMoneyBillWave className="text-gray-400" />
                                    <span>${project.budget.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Projects;
