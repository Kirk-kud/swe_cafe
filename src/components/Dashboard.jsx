import { useSession } from '../context/SessionContext';
import UserProfile from './UserProfile';

const Dashboard = () => {
  const { user } = useSession();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {user?.first_name}!
            </h1>
            <p className="mt-2 text-gray-600">
              You are logged in as a {user?.user_type}
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <UserProfile />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 