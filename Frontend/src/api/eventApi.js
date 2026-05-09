import api from "./axiosConfig";

export const getEvents = async () => {
  const { data } = await api.get("/events");
  return Array.isArray(data) ? data : data?.content || [];
};

export const getEventById = async (id) => {
  const { data } = await api.get(`/events/${id}`);
  return data;
};

export const createEvent = async (payload) => {
  const { data } = await api.post("/events", payload);
  return data;
};

export const updateEvent = async (id, payload) => {
  const { data } = await api.put(`/events/${id}`, payload);
  return data;
};

export const deleteEvent = async (id) => {
  await api.delete(`/events/${id}`);
};
