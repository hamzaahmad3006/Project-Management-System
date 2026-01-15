import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { createCalendarEvent } from '../../../store/slices/calendarSlice';
import { fetchProjects } from '../../../store/slices/projectSlice';
import { EventType } from 'types';
import { AxiosError } from 'axios';

export const useCreateEvent = (onClose: () => void) => {
  const dispatch = useAppDispatch();
  const { projects } = useAppSelector((state) => state.projects);
  const { allUsers } = useAppSelector((state) => state.auth);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<EventType>('MEETING');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [projectId, setProjectId] = useState('');
  const [attendees, setAttendees] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    if (startTime) {
      const selectedDate = new Date(startTime);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setDateError('Start time cannot be in the past');
      } else {
        setDateError('');
      }
    }
  }, [startTime]);

  useEffect(() => {
    if (projects.length === 0) {
      dispatch(fetchProjects());
    }
    if (projects.length > 0 && !projectId) {
      setProjectId(projects[0].id);
    }
  }, [dispatch, projects, projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (new Date(endTime) <= new Date(startTime)) {
      window.toastify('End time must be after start time', 'error');
      return;
    }

    setIsLoading(true);

    try {
      await dispatch(
        createCalendarEvent({
          title,
          description,
          type,
          startTime,
          endTime,
          projectId: projectId || undefined,
          attendees,
        })
      ).unwrap();
      onClose();
      setTitle('');
      setDescription('');
      setStartTime('');
      setEndTime('');
      setProjectId('');
      setAttendees([]);
    } catch (err: unknown) {
      const errorMessage = typeof err === 'string' ? err : 'Failed to create event';
      window.toastify(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    projects,
    allUsers,
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
    attendees,
    setAttendees,
    isLoading,
    handleSubmit,
    dateError,
  };
};
