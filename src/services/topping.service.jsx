import * as httpRequest from "~/utils/httpRequest";

export const topping = "topping";

export const getToppings = async () => {
  try {
    const res = await httpRequest.get(`${topping}`);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};
