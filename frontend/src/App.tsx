import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Routes from './pages/Routes';
import { useEffect } from 'react';
import { fetchProfile } from './store/slices/authSlice';
import { Loader } from 'components/loader/Loader';
import { useTheme } from './hooks/useTheme';
import { useAppDispatch, useAppSelector } from './store/hooks';

function App() {
  useTheme();
  const dispatch = useAppDispatch();
  const { isInitialLoading, user } = useAppSelector((state) => state.auth);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, token, user]);

  if (isInitialLoading) return <Loader />;

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} transition={Bounce} />
      <Routes />
    </>
  );
}

export default App;
