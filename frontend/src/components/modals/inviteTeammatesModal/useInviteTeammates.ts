import { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

export const useInviteTeammates = (isOpen: boolean, onClose: () => void) => {
  const [emailInput, setEmailInput] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedRole, setSelectedRole] = useState('MEMBER');
  const [personalMessage, setPersonalMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (isOpen) {
      const fetchTeams = async () => {
        try {
          const response = await api.get('/teams');
          setTeams(response.data.users || []);
          if (response.data.users?.length > 0) {
            setSelectedTeam(response.data.users[0].name);
          }
        } catch (error) {
          toast.error('Failed to fetch teams');
        }
      };
      fetchTeams();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!emailInput.trim()) {
      toast.error('Please enter at least one email address');
      return;
    }
    if (!selectedTeam) {
      toast.error('Please select a team');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/teams/invite', {
        email: emailInput,
        teamName: selectedTeam,
        role: selectedRole,
        message: personalMessage,
      });

      toast.success(response.data.message || 'Invitations sent!');
      onClose();
      setEmailInput('');
      setPersonalMessage('');
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      const errorMessage = error.response?.data?.message || 'Failed to send invitations!';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    emailInput,
    setEmailInput,
    selectedTeam,
    setSelectedTeam,
    selectedRole,
    setSelectedRole,
    personalMessage,
    setPersonalMessage,
    loading,
    teams,
    handleSend,
  };
};
