import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,

  login: async (email, password, deviceInfo) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('https://api.bondyt.com/api/v1/auth/login', {
        email,
        password,
        device_info: deviceInfo
      });

      const { data } = response.data;
      await AsyncStorage.setItem('accessToken', data.access_token);
      await AsyncStorage.setItem('refreshToken', data.refresh_token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));

      set({
        user: data.user,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'An error occurred',
        isLoading: false
      });
    }
  },

  refreshTokens: async (deviceInfo) => {
    try {
      const response = await axios.post('https://api.bondyt.com/api/v1/auth/refresh', {
        device_info: deviceInfo
      });

      const { data } = response.data;
      await AsyncStorage.setItem('accessToken', data.access_token);
      await AsyncStorage.setItem('refreshToken', data.refresh_token);

      set({
        accessToken: data.access_token,
        refreshToken: data.refresh_token
      });
    } catch (error) {
      set({ error: error.response?.data?.message || 'An error occurred' });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('user');
    set({ user: null, accessToken: null, refreshToken: null });
  },

  initializeAuth: async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const user = await AsyncStorage.getItem('user');

    if (accessToken && refreshToken && user) {
      set({
        accessToken,
        refreshToken,
        user: JSON.parse(user)
      });
    }
  }
}));

export default useAuthStore;
