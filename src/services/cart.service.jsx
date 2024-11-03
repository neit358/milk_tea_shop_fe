import * as httpRequest from "~/utils/httpRequest";

export const cart = "cart";

export const getCarts = async (id) => {
  try {
    const res = await httpRequest.get(`${cart}/${id}`);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};

export const addCart = async (item) => {
  try {
    const res = await httpRequest.post(`${cart}/`, { item });
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};

export const deleteCart = async (item) => {
  try {
    const res = await httpRequest.patch(`${cart}/`, { item });
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};
