import React from 'react';
import { FaTimes, FaEnvelope, FaChevronDown, FaSpinner } from 'react-icons/fa';
import { CreateModalProps } from 'types';
import { useInviteTeammates } from './useInviteTeammates';
import { ButtonLoader } from '../../../components/loader/Loader';
import InputForm from 'components/ui/inputFields/InputForm';
import SelectField from 'components/ui/inputFields/SelectedForm';
import TextAreaForm from 'components/ui/inputFields/TextAreaForm';
import ButtonForm from 'components/ui/buttons/ButtonForm';

const InviteTeammatesModal: React.FC<CreateModalProps> = ({ isOpen, onClose }) => {
  const {
    emailInput,
    setEmailInput,
    selectedTeam,
    setSelectedTeam,
    selectedRole,
    setSelectedRole,
    personalMessage,
    setPersonalMessage,
    loading,
    teams,
    handleSend,
  } = useInviteTeammates(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1a1c23] rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden animate-fade-in-up border border-transparent dark:border-gray-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Invite Teammates
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-1.5">
            <InputForm
              label="Email addresses"
              name="emails"
              type="text"
              value={emailInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailInput(e.target.value)}
              placeholder="name@company.com, name2@company.com"
              icon={<FaEnvelope size={14} />}
              className="w-full pl-9 pr-3 py-2 border border-blue-400 dark:border-blue-500/50 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-shadow"
              labelClassName="text-gray-700 dark:text-gray-300"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Separate multiple emails with commas.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <SelectField
                label="Add to team"
                name="team"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                options={teams.map((team) => ({ label: team.name, value: team.name }))}
                placeholder="Select team"
                icon={<FaChevronDown size={12} />}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md appearance-none focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200"
                labelClassName="block text-sm font-medium text-gray-700 dark:text-gray-300"
              />
            </div>

            <div className="space-y-1.5">
              <SelectField
                label="Role"
                name="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                options={[
                  { label: 'Manager', value: 'MANAGER' },
                  { label: 'Member', value: 'MEMBER' },
                ]}
                placeholder="Select role"
                icon={<FaChevronDown size={12} />}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md appearance-none focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200"
                labelClassName="block text-sm font-medium text-gray-700 dark:text-gray-300"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <TextAreaForm
              label="Personal message (optional)"
              name="personalMessage"
              value={personalMessage}
              onChange={(e) => setPersonalMessage(e.target.value)}
              placeholder="Join us to collaborate on..."
              rows={3}
              disabled={loading}
              labelClassName="block text-sm font-medium text-gray-700 dark:text-gray-300"
              className="border border-gray-300 dark:border-gray-700 rounded-md appearance-none focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <ButtonForm
              label={loading ? <ButtonLoader /> : 'Send Invites'}
              onClick={handleSend}
              disabled={loading}
              size="md"
              variant="primary"
              className="flex items-center gap-2 px-5 py-2 shadow-sm"
            />
            <ButtonForm
              label="Cancel"
              onClick={onClose}
              disabled={loading}
              size="md"
              variant="secondary"
              className="px-5 py-2"
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 dark:bg-[#12141c] border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Read more about{' '}
            <a href="#" className="text-blue-500 dark:text-blue-400 hover:underline">
              roles and permissions
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default InviteTeammatesModal;
