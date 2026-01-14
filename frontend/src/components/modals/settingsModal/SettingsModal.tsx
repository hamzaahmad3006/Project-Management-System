import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { CreateModalProps } from 'types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { useSettings } from './useSettings';

import ProfileSettings from './ProfileSettings';
import SecuritySettings from './SecuritySettings';
import NotificationsSettings from './NotificationsSettings';
import GeneralSettings from './GeneralSettings';

const SettingsModal: React.FC<CreateModalProps> = ({ isOpen, onClose }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    activeTab,
    setActiveTab,
    profile,
    loading,
    preview,
    onImageSelect,
    onRemoveImage,
    handleChange,
    handleSaveProfile,
    handleClose,
    handleDeleteAccount,
  } = useSettings(user, onClose);

  if (!isOpen) return null;

  const allTabs = [
    { id: 'profile', label: 'My Profile' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'general', label: 'General' },
  ];

  const tabs = allTabs.filter((tab) => {
    if (tab.id === 'security' && user?.hasPassword === false) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-surface-card rounded-xl shadow-2xl w-full max-w-4xl h-[600px] flex overflow-hidden animate-in fade-in zoom-in duration-200 border dark:border-gray-800">
        {/* Sidebar (Tabs) */}
        <div className="w-48 bg-gray-50 dark:bg-surface-sidebar border-r border-gray-200 dark:border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-sm font-medium text-brand-muted">Settings</h2>
          </div>
          <nav className="flex-1 p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                                    ${
                                      activeTab === tab.id
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                        : 'text-content-primary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
              >
                {tab.label}
              </button>
            ))}

            <div className="p-4 ">
              <h2 className="text-sm font-medium text-brand-muted">Workspace</h2>
            </div>

            <div className="pl-4 flex justify-between items-start flex-col gap-2">
              <h2 className="pb-4 text-sm font-medium text-content-primary dark:text-gray-300">
                Settings
              </h2>
              <h2 className="pb-4 text-sm font-medium text-content-primary dark:text-gray-300">
                Teamspace
              </h2>
              <h2 className="pb-4 text-sm font-medium text-content-primary dark:text-gray-300">
                Members
              </h2>
              <h2 className="pb-4 text-sm font-medium text-content-primary dark:text-gray-300">
                Integration
              </h2>
            </div>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between p-2 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-content-primary dark:text-gray-100 capitalize">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h3>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 p-6 overflow-y-auto bg-white dark:bg-surface-card">
            {activeTab === 'profile' && (
              <ProfileSettings
                profile={profile}
                onImageSelect={onImageSelect}
                onRemoveImage={onRemoveImage}
                handleChange={handleChange}
                handleSave={handleSaveProfile}
                onCancel={handleClose}
                onDeleteAccount={handleDeleteAccount}
                preview={preview}
                loading={loading}
              />
            )}

            {activeTab === 'security' && <SecuritySettings />}
            {activeTab === 'notifications' && <NotificationsSettings />}
            {activeTab === 'general' && <GeneralSettings />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
