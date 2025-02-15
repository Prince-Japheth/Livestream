import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './authStore';

const useStreamStore = create((set, get) => ({
  activeStreams: [],
  currentStream: null,
  isLoading: false,
  error: null,
  analytics: null,
  comments: [],

  createStream: async (title, duration) => {
    set({ isLoading: true, error: null });
    try {
      const accessToken = useAuthStore.getState().accessToken;
      const response = await axios.post(
        'https://api.bondyt.com/api/v1/streams/create',
        { title, duration },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      const { data } = response.data;
      set({
        currentStream: data.stream,
        isLoading: false
      });
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'An error occurred',
        isLoading: false
      });
    }
  },

  joinStream: async (streamId) => {
    set({ isLoading: true, error: null });
    try {
      const accessToken = useAuthStore.getState().accessToken;
      const response = await axios.post(
        `https://api.bondyt.com/api/v1/streams/${streamId}/join`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      const { data } = response.data;
      set({
        currentStream: data.stream,
        isLoading: false
      });
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'An error occurred',
        isLoading: false
      });
    }
  },

  endStream: async (streamId) => {
    set({ isLoading: true, error: null });
    try {
      const accessToken = useAuthStore.getState().accessToken;
      const response = await axios.post(
        `https://api.bondyt.com/api/v1/streams/${streamId}/end`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      set({
        currentStream: null,
        isLoading: false
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'An error occurred',
        isLoading: false
      });
    }
  },

  fetchActiveStreams: async (page = 1, limit = 10, sort = '-created_at') => {
    set({ isLoading: true, error: null });
    try {
      const accessToken = useAuthStore.getState().accessToken;
      const response = await axios.get(
        `https://api.bondyt.com/api/v1/streams/active?page=${page}&limit=${limit}&sort=${sort}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      const { data } = response.data;
      set({
        activeStreams: data,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'An error occurred',
        isLoading: false
      });
    }
  },

  fetchStreamAnalytics: async (streamId) => {
    set({ isLoading: true, error: null });
    try {
      const accessToken = useAuthStore.getState().accessToken;
      const response = await axios.get(
        `https://api.bondyt.com/api/v1/streams/${streamId}/analytics`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      const { data } = response.data;
      set({
        analytics: data,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'An error occurred',
        isLoading: false
      });
    }
  },

  addComment: async (streamId, comment) => {
    set({ isLoading: true, error: null });
    try {
      const accessToken = useAuthStore.getState().accessToken;
      const response = await axios.post(
        `https://api.bondyt.com/api/v1/streams/${streamId}/comments`,
        { comment },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      const { data } = response.data;
      set(state => ({
        comments: [...state.comments, data],
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || 'An error occurred',
        isLoading: false
      });
    }
  }
}));

export default useStreamStore;
