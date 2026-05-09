import api from "./axiosConfig";

export const createBooking = async (eventId) => {
  const { data } = await api.post("/bookings", { eventId });
  return data;
};

export const getMyBookings = async () => {
  const { data } = await api.get("/bookings/my");
  return Array.isArray(data) ? data : data?.content || [];
};

export const cancelBooking = async (id) => {
  await api.delete(`/bookings/${id}`);
};

export const getAllBookings = async () => {
  const { data } = await api.get("/bookings");
  return Array.isArray(data) ? data : data?.content || [];
};
