import { request } from "../../utils";
const patch = (url, data) =>
  request(
    {
      url: url,
      method: "PATCH",
      data
    },
    { json: true, useMessageError: false }
  );
export const get = (url, params) =>
  request({
    url: url,
    method: "GET",
    params: params
  });

export const post = (url, data) =>
  request(
    {
      url: url,
      method: "POST",
      data: data
    },
    { json: true }
  );

export const updateProfile = data =>
  patch("/api/prophet/user/profile/update", data);
