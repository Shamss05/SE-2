import api from "./axiosConfig";

export const getUserNotifications = async (userId) => {
  const { data } = await api.get(`/notifications/user/${userId}`);
  return Array.isArray(data) ? data : data?.content || [];
};

export const markUserNotificationsRead = async (userId) => {
  const { data } = await api.put(`/notifications/user/${userId}/read`);
  return Array.isArray(data) ? data : data?.content || [];
};
