import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Routes from './pages/Routes'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProfile } from './store/slices/authSlice';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import { Loader } from 'components/loader/Loader';
import { useTheme } from './hooks/useTheme';


function App() {
  useTheme();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((state: RootState) => state.auth);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfile() as any);
    }
  }, [dispatch, token, user]);

  if (loading) return <Loader />;

  return (
    <>
      <ToastContainer position='top-center' autoClose={2000} transition={Bounce} />
      <Routes />
    </>
  );
}


export default App;