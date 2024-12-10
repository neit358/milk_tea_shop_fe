import * as httpRequest from "~/utils/httpRequest";

export const status = "status";

export const getStatuses = async () => {
  try {
    const res = await httpRequest.get(`${status}`);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};
