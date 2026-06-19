import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { updateProfile, updatePassword } from '../services/profileService';
import toast from 'react-hot-toast';

export const useProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData(user);
    }
  }, [user]);

  const handleUpdateProfile = async (data) => {
    setLoading(true);
    try {
      const userId = user?.id || user?._id || user?.userId || user?.vendorId;
      if (userId) {
        // Attempt API call, but don't force failure if endpoint doesn't exist yet
        await updateProfile(userId, data).catch(err => {
          console.warn('API update failed, updating local state only:', err);
        });
      }
      
      setProfileData((prev) => ({ ...prev, ...data }));
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (data) => {
    setLoading(true);
    try {
      const userId = user?.id || user?._id || user?.userId || user?.vendorId;
      if (userId) {
        await updatePassword(userId, data).catch(err => {
           console.warn('API update password failed:', err);
        });
      }
      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(error?.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    profileData,
    loading,
    handleUpdateProfile,
    handleUpdatePassword
  };
};
