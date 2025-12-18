import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductivity, fetchPerformance } from '../../store/slices/reportSlice';
import { AppDispatch, RootState } from '../../store/store';
import { Bar } from 'react-chartjs-2';

const Reports: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { productivity, performance } = useSelector((state: RootState) => state.reports);

    useEffect(() => {
        dispatch(fetchProductivity());
        dispatch(fetchPerformance());
    }, [dispatch]);

    const productivityData = {
        labels: productivity.map((p: any) => p.name),
        datasets: [
            {
                label: 'Completed Tasks',
                data: productivity.map((p: any) => p.completedTasks),
                backgroundColor: '#4f46e5',
            },
            {
                label: 'Created Tasks',
                data: productivity.map((p: any) => p.createdTasks),
                backgroundColor: '#9333ea',
            },
        ],
    };

    return (
        <div className="space-y-6 container mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Analytics Reports</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#1a1c23] p-6 rounded-lg shadow dark:shadow-none border border-transparent dark:border-gray-800">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Team Productivity</h3>
                    <Bar data={productivityData} />
                </div>

                <div className="bg-white dark:bg-[#1a1c23] p-6 rounded-lg shadow dark:shadow-none border border-transparent dark:border-gray-800">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Task Performance</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                            <span className="text-gray-600 dark:text-gray-400">Total Tasks</span>
                            <span className="font-bold text-xl text-gray-900 dark:text-gray-100">{performance?.total || 0}</span>
                        </div>
                        {performance?.byStatus.map((status: any) => (
                            <div key={status.status} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                                <span className="text-gray-600 dark:text-gray-400">{status.status.replace('_', ' ')}</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{status._count._all}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
