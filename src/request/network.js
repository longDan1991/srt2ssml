import { message } from "ant-design-vue";
import { querystringify } from "../helpers/querstring";

const showErrorMsg = (msg) => message.error(msg, 3);

const unLogin = () => {
  location.reload();
};

class NetworkManagement {
  host;
  params = {};
  headers = {};
  constructor(host) {
    this.host = host;
  }
  supplement = (params, headers) => {
    this.params = params;
    this.headers = headers;
  };

  request = async (path, method, body, headers, handle, showMsg = true) => {
    const url = `${this.host}${path}`;

    if (handle) {
      return await handle(url, method, body, headers);
    }

    try {
      const result = await fetch(url, {
        mode: "cors",
        credentials: "include",
        method,
        body,
        headers: {
          "X-Requested-with": "XMLHttpRequest",
          ...this.headers,
          ...headers,
        },
      });
      const data = await result.json();
      if (data?.code === 10006 && !path.includes("open/muser/detail")) {
        return unLogin();
      }
      if (data?.code !== 200 && data?.code !== 10006 && showMsg) {
        if (typeof data?.message === "string") showErrorMsg(data?.message);
      }
      return data;
    } catch (error) {
      console.error(error);
      if (typeof error === "string") showErrorMsg(error);
      return error;
    }
  };
}

const beeNetwork = new NetworkManagement(import.meta.env.VITE_BEE_API_HOST);
export const get = (path, data, handle) => {
  const newData = { ...data, ...beeNetwork.params };
  const params = querystringify(newData, true);
  const headers = {
    "Content-Type": "application/json",
  };
  return beeNetwork.request(path + params, "GET", null, headers, handle);
};

export const post = (path, data, handle, showMsg) => {
  const body = JSON.stringify({ ...data, ...beeNetwork.params });
  const headers = {
    "Content-Type": "application/json",
  };
  return beeNetwork.request(path, "POST", body, headers, handle, showMsg);
};

export const upload = (path, file) => {
  return beeNetwork.request(path, "POST", file);
};

export const deleted = (path, data) => {
  return beeNetwork.request(path, "DELETE", data);
};

export const supplementConfigToNetworkManagement = (body, headers) =>
  beeNetwork.supplement(body, headers);

export const put = (path, data) => {
  const newData = { ...data, ...beeNetwork.params };
  const params = querystringify(newData, true);
  return beeNetwork.request(path + params, "PUT");
};

export const download = (path, data) => {
  const link = document.createElement("a");
  const params = querystringify({ ...data, ...beeNetwork.params }, true);
  link.style.display = "none";
  link.href = `${beeNetwork.host}${path}${params}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
