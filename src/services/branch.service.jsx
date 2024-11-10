import * as httpRequest from "~/utils/httpRequest";

export const branch = "branch";

export const getBranchs = async () => {
  try {
    const res = await httpRequest.get(`${branch}`);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};
