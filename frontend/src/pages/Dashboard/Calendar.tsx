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
            case 'MEETING': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'DEADLINE': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Calendar</h1>

            <div className="bg-white rounded-lg shadow p-6">
                {loading ? (
                    <div className="text-center py-10">Loading events...</div>
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
                                    <span className="text-xs font-bold px-2 py-1 rounded bg-white bg-opacity-50">
                                        {event.type}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {events.length === 0 && (
                            <p className="text-center text-gray-500">No upcoming events</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Calendar;
