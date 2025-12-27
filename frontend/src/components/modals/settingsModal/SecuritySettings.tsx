import ButtonForm from 'components/ui/buttons/ButtonForm';
import InputForm from 'components/ui/inputFields/InputForm';


const SecuritySettings = () => (
    <div className="space-y-6 max-w-lg animate-in fade-in duration-300">
        <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-6 uppercase tracking-wider">Change Password</h4>
            <div className="space-y-5">
                <div>
                    <InputForm
                        label="Current Password"
                        name="currentPassword"
                        placeholder="Enter current password"
                        type="password"
                        value=""
                        onChange={() => { }}
                        className="px-3 py-2"
                    />
                </div>
                <div>
                    <InputForm
                        label="New Password"
                        name="newPassword"
                        placeholder="Enter new password"
                        type="password"
                        value=""
                        onChange={() => { }}
                        className="px-3 py-2"
                    />
                </div>
            </div>
        </div>
        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
            <ButtonForm
                label="Update Password"
                onClick={() => { }}
                disabled={false}
                variant="primary"
                size="md"
            />

        </div>
    </div>
);

export default SecuritySettings;
