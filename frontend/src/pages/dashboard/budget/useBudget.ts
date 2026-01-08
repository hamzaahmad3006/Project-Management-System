import { useDispatch, useSelector } from 'react-redux';
import { fetchBudgetOverview } from '../../../store/slices/budgetSlice';
import { AppDispatch, RootState } from '../../../store/store';
import { useEffect } from 'react';

export const useBudgetHook = () => {
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

    return { overview, projects, loading, chartData };
};  