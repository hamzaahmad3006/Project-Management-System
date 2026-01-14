import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { useInvitationHandler } from './useInvitationHandler';

const InvitationHandler: React.FC = () => {
  const { status, message, navigate } = useInvitationHandler();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
        {status === 'loading' && (
          <>
            <FaSpinner className="w-16 h-16 text-blue-500 animate-spin mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800">Processing Invitation...</h2>
            <p className="text-gray-600">Please wait while we process your request.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800">Success!</h2>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-400">Redirecting you to dashboard...</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-xl transition-all"
            >
              Go to Dashboard
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <FaTimesCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800">Oops!</h2>
            <p className="text-gray-600">{message}</p>
            <button
              onClick={() => navigate('/auth/login')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
            >
              Sign In
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default InvitationHandler;
