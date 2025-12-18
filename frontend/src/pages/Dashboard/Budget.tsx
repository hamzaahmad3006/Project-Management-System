import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBudgetOverview } from '../../store/slices/budgetSlice';
import { AppDispatch, RootState } from '../../store/store';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Budget: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { overview, projects, loading } = useSelector((state: RootState) => state.budget);

    useEffect(() => {
        dispatch(fetchBudgetOverview());
    }, [dispatch]);

    const chartData = {
        labels: ['Spent', 'Remaining'],
        datasets: [
            {
                data: [overview?.totalSpent || 0, overview?.remaining || 0],
                backgroundColor: ['#ef4444', '#22c55e'],
                hoverBackgroundColor: ['#dc2626', '#16a34a'],
            },
        ],
    };

    return (
        <div className="space-y-6 container mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Budget Overview</h1>

            {loading ? (
                <div className="text-center py-10 dark:text-gray-400">Loading budget...</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 bg-white dark:bg-[#1a1c23] p-6 rounded-lg shadow dark:shadow-none border border-transparent dark:border-gray-800">
                        <h3 className="text-lg font-semibold mb-4 text-center text-gray-900 dark:text-gray-100">Total Budget Utilization</h3>
                        <div className="h-64 flex justify-center">
                            <Doughnut data={chartData} />
                        </div>
                        <div className="mt-6 text-center">
                            <p className="text-gray-500 dark:text-gray-400">Total Budget</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">${overview?.totalBudget.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-white dark:bg-[#1a1c23] p-6 rounded-lg shadow dark:shadow-none border border-transparent dark:border-gray-800">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Project Budgets</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Budget</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Spent</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-[#1a1c23] divide-y divide-gray-200 dark:divide-gray-800">
                                    {projects.map((project: any) => (
                                        <tr key={project.id}>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">{project.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">${project.budget.toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-red-500 dark:text-red-400">${project.spent.toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                           ${project.spent > project.budget ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'}`}>
                                                    {project.spent > project.budget ? 'Over Budget' : 'On Track'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Budget;
