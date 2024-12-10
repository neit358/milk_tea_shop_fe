import * as httpRequest from "~/utils/httpRequest";

export const promotion = "promotion";

export const getPromotion = async (id) => {
  try {
    const res = await httpRequest.get(`${promotion}/${id}`);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};

export const getPromotions = async () => {
  try {
    const res = await httpRequest.get(`${promotion}`);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};

export const updatePromotions = async (id, data) => {
  try {
    const res = await httpRequest.patch(`${promotion}/${id}`, data);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};

export const createPromotions = async (data) => {
  try {
    const res = await httpRequest.post(`${promotion}`, data);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};

export const applyPromotions = async (id, data) => {
  try {
    const res = await httpRequest.patch(
      `${promotion}/${id}/apply-promotion`,
      data
    );
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};

export const deletePromotion = async (id) => {
  try {
    const res = await httpRequest.del(`${promotion}/${id}`);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};
