import { useSession } from '../context/SessionContext';

const UserProfile = () => {
  const { user } = useSession();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <p className="mt-1 text-gray-900">{user?.first_name}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <p className="mt-1 text-gray-900">{user?.last_name}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="mt-1 text-gray-900">{user?.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">User Type</label>
          <p className="mt-1 text-gray-900 capitalize">{user?.user_type}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 