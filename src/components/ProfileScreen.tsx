import React, { useState } from 'react';
import { User, Calendar, Ruler, Weight, LogOut, ChevronLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface ProfileScreenProps {
  onBack: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack }) => {
  const { user, updateUserProfile, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    age: user?.age?.toString() || '',
    height_cm: user?.height_cm?.toString() || '',
    current_weight_kg: user?.current_weight_kg?.toString() || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    const success = await updateUserProfile({
      username: formData.username,
      age: formData.age ? parseInt(formData.age) : undefined,
      height_cm: formData.height_cm ? parseFloat(formData.height_cm) : undefined,
      current_weight_kg: formData.current_weight_kg ? parseFloat(formData.current_weight_kg) : undefined,
    });

    if (success) {
      setIsEditing(false);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
      onBack();
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-violet-500/30 px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center text-white hover:opacity-70 transition-opacity"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-white">Profile</h1>
          <div className="w-6"></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-md mx-auto py-8">
        {/* Profile Avatar */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 to-pink-500 rounded-full shadow-lg mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">{user.username}</h2>
          <p className="text-slate-400 text-sm">{user.email}</p>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-6 mb-6">
          {isEditing ? (
            // Edit Form
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    name="height_cm"
                    value={formData.height_cm}
                    onChange={handleChange}
                    step="0.1"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="current_weight_kg"
                  value={formData.current_weight_kg}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all font-medium disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          ) : (
            // View Mode
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-400">Age</p>
                    <p className="text-white font-medium">{user.age || 'Not set'}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Ruler className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-400">Height</p>
                    <p className="text-white font-medium">
                      {user.height_cm ? `${user.height_cm} cm` : 'Not set'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Weight className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-400">Weight</p>
                    <p className="text-white font-medium">
                      {user.current_weight_kg ? `${user.current_weight_kg} kg` : 'Not set'}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="w-full mt-4 px-4 py-3 bg-violet-500/20 text-violet-300 rounded-xl hover:bg-violet-500/30 transition-colors font-medium"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 rounded-2xl hover:bg-red-500/20 transition-colors font-medium border border-red-500/20"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};
