import * as httpRequest from "~/utils/httpRequest";

export const sweet = "sweet";

export const getSweets = async () => {
  try {
    const res = await httpRequest.get(`${sweet}`);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};
