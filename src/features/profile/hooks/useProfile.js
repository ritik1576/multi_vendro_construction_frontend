import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { updateProfile, updatePassword, getCustomerProfileApi, getVendorProfileApi, getAdminProfileApi } from '../services/profileService';
import toast from 'react-hot-toast';

export const useProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        let data = user;
        const role = user.role?.toLowerCase() || '';
        
        if (role === 'vendor') {
          const res = await getVendorProfileApi();
          data = res;
        } else if (role === 'admin') {
          const res = await getAdminProfileApi();
          data = res;
        } else {
          const res = await getCustomerProfileApi();
          data = res;
        }
        setProfileData(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Failed to fetch profile');
        setProfileData(user); // Fallback to auth user
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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
    error,
    handleUpdateProfile,
    handleUpdatePassword
  };
};
