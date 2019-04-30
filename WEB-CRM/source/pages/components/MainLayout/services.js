import { request } from "../../../utils";

export const patch = (url, data) =>
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

// 获取消息中心的消息列表
export const getMailboxInboxList = data =>
  get("/api/mailbox/inbox/list", data);
