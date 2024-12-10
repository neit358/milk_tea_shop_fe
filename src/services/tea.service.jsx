import * as httpRequest from "~/utils/httpRequest";

export const tea = "tea";

export const getTeas = async () => {
  try {
    const res = await httpRequest.get(`${tea}`);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};
