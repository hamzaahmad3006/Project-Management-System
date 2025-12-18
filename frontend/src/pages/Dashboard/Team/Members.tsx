import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeamMembers } from '../../../store/slices/teamSlice';
import { fetchAllUsers } from '../../../store/slices/authSlice';
import { AppDispatch, RootState } from '../../../store/store';
import Loader from "components/Loaders/Loader";
import { User } from '../../../types';
import { useAppSelector } from "store/hooks";

export default function MembersTab() {

    const dispatch = useDispatch<AppDispatch>();
    const { members, loading } = useSelector((state: RootState) => state.team);
    const allUsers: User[] = useAppSelector((state) => state.auth.allUsers || []);

    useEffect(() => {
        dispatch(fetchTeamMembers());
        dispatch(fetchAllUsers());
    }, [dispatch]);





    if (loading) return <Loader />;

    return (
        <div className="flex-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* PROJECT TABLE */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-[#1a1c23]">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
                        <tr>
                            <th className="text-left p-4 font-semibold">Name</th>
                            <th className="text-left p-4 font-semibold">Position</th>
                            <th className="text-left p-4 font-semibold">Team groups</th>
                            <th className="text-left p-4 font-semibold">Location</th>

                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {allUsers.length > 0 ? (
                            allUsers.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center">

                                            {item.avatar ? (
                                                <img
                                                    src={item.avatar}
                                                    alt={item.name}
                                                    className="w-9 h-9 rounded-full mr-3 border border-gray-100 dark:border-gray-700"
                                                />
                                            ) : (
                                                <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-3 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                                                    {item.name.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</div>
                                                <div className="text-gray-500 dark:text-gray-400 text-xs">{item.email}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-4">
                                        <span
                                            className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-transparent dark:border-gray-700"
                                        >
                                            {item.role || 'Member'}
                                        </span>
                                    </td>

                                    <td className="p-4">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            {item.teamMemberships && item.teamMemberships.length > 0
                                                ? item.teamMemberships.map((tm: any) => tm.team?.name).join(', ')
                                                : '-'}
                                        </span>
                                    </td>

                                    <td className="p-4">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Faisalabad, Pakistan
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-10 text-center text-gray-500 dark:text-gray-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-2xl">👤</span>
                                        <span>No members found</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
