import { Bounce, ToastContainer } from 'react-toastify';
import './App.css';
import Routes from './pages/Routes'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProfile } from './store/slices/authSlice';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import Loader from 'components/Loaders/Loader';
import { useTheme } from './hooks/useTheme';


function App() {
  useTheme();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((state: RootState) => state.auth);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token && !user) { // agar token hai aur user null hai
      dispatch(fetchProfile() as any);
    }
  }, [dispatch, token, user]);

  if (loading) return <Loader />; // Loader tab tak dikhe jab tak profile fetch nahi hota

  return (
    <>
      <ToastContainer position='top-center' autoClose={2000} transition={Bounce} />
      <Routes />
    </>
  );
}


export default App;