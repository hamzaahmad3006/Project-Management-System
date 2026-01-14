import React, { useState } from 'react';
import ButtonForm from 'components/ui/buttons/ButtonForm';

const TailwindSwitch = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
      checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

const NotificationsSettings = () => {
  const [settings, setSettings] = useState({
    activityUpdates: true,
    mentions: true,
    dailyDigest: true,
    tipsAndTricks: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-surface-card rounded-lg space-y-8 animate-in fade-in duration-300">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">
        Notifications
      </h2>

      <div className="space-y-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="font-bold text-gray-800 dark:text-gray-200">Activity updates</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
              New tasks assigned to you, @mentions, and completion notifications for tasks you're a
              collaborator on
            </p>
          </div>
          <TailwindSwitch
            checked={settings.activityUpdates}
            onChange={() => handleToggle('activityUpdates')}
          />
        </div>

        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="font-bold text-gray-800 dark:text-gray-200">Mentions</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
              New tasks assigned to you, direct messages, and @mentions
            </p>
          </div>
          <TailwindSwitch checked={settings.mentions} onChange={() => handleToggle('mentions')} />
        </div>
        <hr className="border-gray-100 dark:border-gray-800" />
      </div>

      <div className="space-y-6">
        <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Emails
        </p>

        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="font-bold text-gray-800 dark:text-gray-200">Daily digest</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
              Personalized productivity stats plus your tasks due today.
            </p>
          </div>
          <TailwindSwitch
            checked={settings.dailyDigest}
            onChange={() => handleToggle('dailyDigest')}
          />
        </div>

        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="font-bold text-gray-800 dark:text-gray-200">Tips and tricks</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
              Powerful productivity advice in your inbox, Sent once a month.
            </p>
          </div>
          <TailwindSwitch
            checked={settings.tipsAndTricks}
            onChange={() => handleToggle('tipsAndTricks')}
          />
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-gray-800 pt-6 flex items-center gap-3">
        <ButtonForm
          label="Save Changes"
          onClick={() => {}}
          disabled={false}
          variant="primary"
          size="md"
        />
        <ButtonForm
          label="Cancel"
          onClick={() => {}}
          disabled={false}
          variant="secondary"
          size="md"
        />
      </div>
    </div>
  );
};

export default NotificationsSettings;
