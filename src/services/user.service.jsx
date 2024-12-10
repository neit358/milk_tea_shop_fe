import * as httpRequest from "~/utils/httpRequest";

export const user = "user";

export const updateUser = async (id, data) => {
  try {
    const res = await httpRequest.patch(`${user}/${id}`, data);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};

export const changePassword = async (id, data) => {
  try {
    const res = await httpRequest.patch(`${user}/change-password/${id}`, data);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};
