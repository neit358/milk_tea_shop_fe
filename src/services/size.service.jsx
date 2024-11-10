import * as httpRequest from "~/utils/httpRequest";

export const size = "size";

export const getSizes = async () => {
  try {
    const res = await httpRequest.get(`${size}`);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};
