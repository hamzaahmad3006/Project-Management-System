import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { signInWithPopup, UserInfo } from 'firebase/auth';
import { auth, githubProvider, provider } from 'config/firebase';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { loginwithgithub, loginwithgoogle, register } from 'store/slices/authSlice';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

export const useRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'MEMBER' as 'MEMBER' | 'MANAGER',
  });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSinginWithGoogle = async (e: React.FormEvent) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const email = user.email || user.providerData?.find((p: UserInfo) => p.email)?.email || null;

      if (!email) {
        console.error('Firebase User Object without email:', user);
        window.toastify(
          'Could not retrieve email from Google. Please ensure your Google account has a shared email.',
          'error'
        );
        return;
      }

      const payload = await dispatch(
        loginwithgoogle({
          email,
          name: user.displayName,
          photoURL: user.photoURL,
        })
      ).unwrap();
      console.log('payload', payload);
      console.log('user', user);

      navigate('/');
    } catch (err: unknown) {
      const errorMessage = typeof err === 'string' ? err : 'Google sign in failed';
      window.toastify(errorMessage, 'error');
    }
  };
  const handleSigninWithGithub = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      const email = user.email || user.providerData?.find((p) => p.email)?.email || null;

      await dispatch(
        loginwithgithub({
          email,
          name: user.displayName,
          photoURL: user.photoURL,
        })
      ).unwrap();

      navigate('/');
    } catch (err: unknown) {
      const errorMessage = typeof err === 'string' ? err : 'GitHub sign in failed';
      window.toastify(errorMessage, 'error');
    }
  };
  const handleSinginWithFigma = async (e: React.FormEvent) => {
    alert('Figma Signin');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(
        register({
          email: formData.email,
          name: formData.name || formData.email.split('@')[0],
          role: formData.role,
        })
      ).unwrap();

      window.toastify('Account created successfully! Check your email for password.');
      navigate('/auth/login');
    } catch (err: unknown) {
      const errorMessage = typeof err === 'string' ? err : 'Registration failed';
      window.toastify(errorMessage, 'error');
    }
  };

  return {
    formData,
    handleChange,
    handleSinginWithGoogle,
    handleSigninWithGithub,
    handleSinginWithFigma,
    handleSubmit,
    loading,
    error,
  };
};
