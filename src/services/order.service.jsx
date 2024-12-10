import * as httpRequest from "~/utils/httpRequest";

export const order = "order";

export const getOrder = async () => {
  try {
    const res = await httpRequest.get(`${order}/`);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};

export const getOrderById = async (id) => {
  try {
    const res = await httpRequest.get(`${order}/${id}`);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};

export const getOrders = async () => {
  try {
    const res = await httpRequest.get(`${order}/all`);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};

export const filterOrders = async (data) => {
  try {
    const res = await httpRequest.post(`${order}/filter`, data);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};

export const reportOrders = async (filter) => {
  try {
    const res = await httpRequest.post(`${order}/report`, filter);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};

export const addOrder = async (item) => {
  try {
    const res = await httpRequest.post(`${order}/`, item);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};

export const cancelOrder = async (id) => {
  try {
    const res = await httpRequest.del(`${order}/${id}`);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};

export const updateOrder = async (id, data) => {
  try {
    const res = await httpRequest.patch(`${order}/${id}`, data);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};
