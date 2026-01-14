import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import { AxiosError } from 'axios';

export const useInvitationHandler = () => {
  const { token, action } = useParams<{ token: string; action: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleInvitation = async () => {
      try {
        if (!token || !action) {
          setStatus('error');
          setMessage('Invalid invitation link');
          return;
        }

        const response = await api.get(`/teams/invitation/${token}/${action}`);
        setStatus('success');
        setMessage(response.data.message);

        setTimeout(() => {
          navigate('/');
        }, 3000);
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        setStatus('error');
        setMessage(err.response?.data?.message || 'Something went wrong');
      }
    };

    handleInvitation();
  }, [token, action, navigate]);

  return {
    status,
    message,
    navigate,
  };
};
