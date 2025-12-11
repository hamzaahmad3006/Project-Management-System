import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeamMembers } from '../../../store/slices/teamSlice';
import { AppDispatch, RootState } from '../../../store/store';
import Loader from "components/Loaders/Loader";

export default function MembersTab() {

    const dispatch = useDispatch<AppDispatch>();
    const { members, loading } = useSelector((state: RootState) => state.team);

    useEffect(() => {
        dispatch(fetchTeamMembers());
    }, [dispatch]);





    if (loading) return <Loader />;

    return (
        <div className="flex-1">
            {/* PROJECT TABLE */}
            <div className="border rounded-xl overflow-hidden shadow-sm bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="text-left p-3">Name</th>
                            <th className="text-left p-3">Position</th>
                            <th className="text-left p-3">Team groups</th>
                            <th className="text-left p-3">Location</th>

                        </tr>
                    </thead>

                    <tbody>
                        {members.length > 0 ? (
                            members.map((item, index) => (
                                <tr key={index} className="border-t hover:bg-gray-50">
                                    <td className="p-3">
                                        <div className="flex items-center">

                                            {item.avatar ? (
                                                <img
                                                    src={item.avatar}
                                                    alt={item.name}
                                                    className="w-8 h-8 rounded-full mr-2"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gray-100 mr-2"></div>
                                            )}
                                            <div className="font-medium text-gray-900">{item.name}</div>
                                            <div className="text-gray-500 text-xs pl-2">{item.email}</div>
                                        </div>
                                    </td>

                                    <td className="p-3">
                                        <span
                                            className="px-2 py-1 text-xs rounded-full  text-[#646569]"
                                        >
                                            {item.role || 'Member'}
                                        </span>
                                    </td>

                                    <td className="p-3">
                                        <span className="text-gray-600">-</span>
                                    </td>

                                    <td className="p-3">
                                        <span className="text-gray-600">
                                            Faisalabad, Pakistan
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-5 text-center text-gray-500">No members found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
