import * as httpRequest from "~/utils/httpRequest";

export const auth = "auth";

export const login = async (data) => {
  try {
    const res = await httpRequest.post(`${auth}/login`, data);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};

export const register = async (data) => {
  try {
    const res = await httpRequest.post(`${auth}/register`, data);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};

export const logout = async () => {
  try {
    const res = await httpRequest.get(`${auth}/logout`);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};

export const checkAuth = async () => {
  try {
    const res = await httpRequest.get(`${auth}/checkAuth`);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};
