import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { RootState } from '../../store/store';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Navbar: React.FC = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <header className="bg-white shadow-sm z-10">
            <div className="flex items-center justify-between px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    Welcome back, {user?.name}
                </h2>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full" />
                        ) : (
                            <FaUserCircle className="w-8 h-8 text-gray-400" />
                        )}
                        <span className="text-sm font-medium text-gray-700">{user?.role}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                        title="Logout"
                    >
                        <FaSignOutAlt size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
