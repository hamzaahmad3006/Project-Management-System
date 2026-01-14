import { useState } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { addSubtask } from '../../../store/slices/taskSlice';

export const useSubtaskModal = (onClose: () => void, taskId: string) => {
  const [title, setTitle] = useState('');
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await dispatch(addSubtask({ taskId, title })).unwrap();
      setTitle('');
      onClose();
    } catch (error) {
      console.error('Failed to add subtask:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    title,
    setTitle,
    loading,
    handleSubmit,
  };
};
