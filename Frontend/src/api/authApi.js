import api from "./axiosConfig";

const normalizeAuth = (data) => {
  const token = data?.token || data?.jwt || data?.accessToken;
  if (!token) {
    throw new Error("Login response did not include an access token.");
  }

  const user = data?.user || {
    id: data?.id || data?.userId,
    fullName: data?.fullName || data?.name,
    email: data?.email,
    role: data?.role
  };

  return { token, user };
};

export const register = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

export const login = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return normalizeAuth(data);
};

export const getMe = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};
