import api from "./axiosConfig";

export const getUsers = async () => {
  const { data } = await api.get("/users");
  return Array.isArray(data) ? data : data?.content || [];
};

export const updateUserRole = async (id, role) => {
  const { data } = await api.put(`/users/${id}/role`, { role });
  return data;
};

export const deleteUser = async (id) => {
  await api.delete(`/users/${id}`);
};
