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
    const res = await httpRequest.post(`${cart}/`, item);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};

export const deleteCart = async (id, data) => {
  try {
    const res = await httpRequest.patch(`${cart}/${id}`, data);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};

export const updateCart = async (id, data) => {
  try {
    const res = await httpRequest.patch(`${cart}/update/${id}`, data);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};
