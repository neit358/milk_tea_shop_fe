import axios from "axios";

const httpRequest = axios.create({
  baseURL: "http://localhost:3002/api/v1/",
  withCredentials: true,
});

export const get = async (path, body) => {
  const res = await httpRequest.get(path, body);
  return res;
};

export const post = async (path, body, options) => {
  const res = await httpRequest.post(path, body, options);
  return res;
};

export const patch = async (path, body, options) => {
  const res = await httpRequest.patch(path, body, options);
  return res;
};

export const put = async (path, body, options) => {
  const res = await httpRequest.put(path, body, options);
  return res;
};

export const del = async (path, options) => {
  const res = await httpRequest.delete(path, options);
  return res;
};

export default httpRequest;
