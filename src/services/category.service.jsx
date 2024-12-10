import * as httpRequest from "~/utils/httpRequest";

export const category = "category";

export const getCategory = async (id) => {
  try {
    const res = await httpRequest.get(`${category}/${id}`);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};

export const getCategories = async () => {
  try {
    const res = await httpRequest.get(`${category}`);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};

export const deleteCategory = async (id) => {
  try {
    const res = await httpRequest.patch(`${category}/delete/${id}`);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};

export const createCategory = async (data) => {
  try {
    const res = await httpRequest.post(`${category}`, data);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};

export const updateCategory = async (id, data) => {
  try {
    const res = await httpRequest.patch(`${category}/${id}`, data);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};
