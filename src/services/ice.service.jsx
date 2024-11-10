import * as httpRequest from "~/utils/httpRequest";

export const ice = "ice";

export const getIces = async () => {
  try {
    const res = await httpRequest.get(`${ice}`);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};
