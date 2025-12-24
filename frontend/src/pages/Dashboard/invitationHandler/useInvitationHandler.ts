import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../api/axios';

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

                // Redirect to dashboard after 3 seconds if success
                setTimeout(() => {
                    navigate('/dashboard');
                }, 3000);
            } catch (error: any) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Something went wrong');
            }
        };

        handleInvitation();
    }, [token, action, navigate]);

    return {
        status,
        message,
        navigate,
    }
}