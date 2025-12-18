import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../../store/slices/calendarSlice';
import { AppDispatch, RootState } from '../../store/store';

const Calendar: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { events, loading } = useSelector((state: RootState) => state.calendar);

    useEffect(() => {
        dispatch(fetchEvents({}));
    }, [dispatch]);

    const getEventColor = (type: string) => {
        switch (type) {
            case 'MEETING': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 border-purple-200 dark:border-purple-800/50';
            case 'DEADLINE': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800/50';
            default: return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-800/50';
        }
    };

    return (
        <div className="space-y-6 container mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Calendar</h1>

            <div className="bg-white dark:bg-[#1a1c23] rounded-lg shadow dark:shadow-none border border-transparent dark:border-gray-800 p-6">
                {loading ? (
                    <div className="text-center py-10 dark:text-gray-400">Loading events...</div>
                ) : (
                    <div className="space-y-4">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className={`p-4 rounded-lg border-l-4 ${getEventColor(event.type)}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold">{event.title}</h3>
                                        <p className="text-sm opacity-75">
                                            {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleTimeString()}
                                        </p>
                                    </div>
                                    <span className="text-xs font-bold px-2 py-1 rounded bg-white bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50">
                                        {event.type}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {events.length === 0 && (
                            <p className="text-center text-gray-500 dark:text-gray-400">No upcoming events</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Calendar;
