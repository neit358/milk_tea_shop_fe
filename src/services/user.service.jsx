import * as httpRequest from "~/utils/httpRequest";

export const user = "user";

export const updateUser = async (id, data) => {
  try {
    const res = await httpRequest.post(`${user}/update/${id}`, data);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};
