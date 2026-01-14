import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { createProject } from '../../../store/slices/projectSlice';
import { getTeams } from '../../../store/slices/teamSlice';

export const useCreateProject = (onClose: () => void) => {
  const dispatch = useAppDispatch();
  const { allTeams } = useAppSelector((state) => state.team);

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [teamId, setTeamId] = useState('');
  const [budget, setBudget] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(getTeams());
  }, [dispatch]);

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    setIsGalleryOpen(false);
  };

  const handleCreate = async () => {
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const today = new Date();
      const endDate = new Date();
      endDate.setDate(today.getDate() + 30);

      await dispatch(
        createProject({
          name,
          description,
          budget,
          teamId: teamId || undefined,
          startDate: today.toISOString(),
          endDate: endDate.toISOString(),
        })
      ).unwrap();

      setName('');
      setDescription('');
      setTeamId('');
      setBudget(0);
      onClose();
      window.toastify('Project created successfully', 'success');
    } catch (err: unknown) {
      const errorMessage = typeof err === 'string' ? err : 'Failed to create project';
      window.toastify(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    allTeams,
    isGalleryOpen,
    setIsGalleryOpen,
    selectedTemplate,
    handleTemplateSelect,
    name,
    setName,
    description,
    setDescription,
    teamId,
    setTeamId,
    budget,
    setBudget,
    isLoading,
    handleCreate,
  };
};
