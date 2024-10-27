import * as httpRequest from "~/utils/httpRequest";

export const type = "type";

export const getType = async (id) => {
  try {
    const res = await httpRequest.get(`${type}/${id}`);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};

export const getTypes = async () => {
  try {
    const res = await httpRequest.get(`${type}`);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};
