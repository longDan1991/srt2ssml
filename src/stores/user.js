import { computed, shallowRef } from "vue";
import { defineStore } from "pinia";
import {
  fetchUserInfo,
  getAuthorizationByCode,
  logout,
  setUserInfo,
} from "../request";
import { supplementConfigToNetworkManagement } from "../request/network";

export const USER_STATE = {
  UN_LOGIN: 1,
  UN_SETTING: 2,
  DONE: 3,
};

export const useUserStore = defineStore("user", () => {
  const userInfo = shallowRef({});
  const menusAth = shallowRef([]);
  const hasUserInfo = computed(() => Boolean(userInfo.value.username));

  const fetchUserInfoByCode = async (code) => {
    const result = await getAuthorizationByCode(code);
    if (result?.code === 200 && result.data) {
      const { muser, menus } = result.data || {};
      userInfo.value = muser;
      menusAth.value = menus;
      await fetchUserInfo_();
    }
    return result;
  };

  const fetchUserInfo_ = async () => {
    const result = await fetchUserInfo();
    if (result?.code === 200 && result.data) {
      const { muser, apps = [], menus } = result.data || {};
      userInfo.value = muser;
      menusAth.value = menus;
      supplementConfigToNetworkManagement({ appId: Number(apps[0]?.id) });
    }
    return result;
  };

  const getUserState = async () => {
    if (hasUserInfo.value) {
      return USER_STATE.DONE;
    } else if (Object.keys(userInfo.value) > 0) {
      return USER_STATE.UN_SETTING;
    }
    const result = await fetchUserInfo_();
    if (result?.code === 200 && result.data) {
      const muser = result.data.muser;
      if (muser.username) {
        return USER_STATE.DONE;
      }
    } else {
      return USER_STATE.UN_LOGIN;
    }
    return USER_STATE.UN_SETTING;
  };

  const setUserInfo_ = async (data) => {
    const result = await setUserInfo(data);
    fetchUserInfo_();
    return result;
  };

  const logout_ = async () => {
    await logout();
    userInfo.value = {};
  };

  return {
    userInfo,
    hasUserInfo,
    fetchUserInfoByCode,
    getUserState,
    setUserInfo: setUserInfo_,
    logout: logout_,
    menusAth,
  };
});
