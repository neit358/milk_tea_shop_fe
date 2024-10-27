import * as httpRequest from "~/utils/httpRequest";

export const upload = "upload";

export const uploadImage = async (formData) => {
  try {
    const res = await httpRequest.post(`${upload}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};
