import React from 'react';
import { IconType } from 'react-icons';

interface KPICardProps {
    title: string;
    value: number | string;
    icon: IconType;
    color: string;
    trend?: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon: Icon, color, trend }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
                {trend && (
                    <p className="text-sm text-green-500 mt-1 flex items-center">
                        <span>{trend}</span>
                    </p>
                )}
            </div>
            <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
        </div>
    );
};

export default KPICard;
