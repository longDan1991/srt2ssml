import { describe, it, expect, beforeEach, vi } from "vitest";
import { computed } from "vue";
import { setActivePinia, createPinia } from "pinia";
import { USER_STATE, useUserStore } from "../user";
import { initializeMockUser } from "../../request/__mocks__/user";

vi.mock("@/request/user.js");

describe("stores user", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("fetchUserInfoByCode", async () => {
    initializeMockUser();
    const userStore = useUserStore();

    const userInfo = computed(() => userStore.userInfo);
    const hasUserInfo = computed(() => userStore.hasUserInfo);

    // 1
    expect(userInfo.value).toEqual({});
    expect(hasUserInfo.value).toBe(false);

    // 2
    await userStore.fetchUserInfoByCode("xxx");
    expect(userInfo.value).toHaveProperty("username");
    expect(userInfo.value).toHaveProperty("description");
    expect(userInfo.value).toHaveProperty("logo");
  });

  it("getUserState", async () => {
    initializeMockUser();
    const userStore = useUserStore();

    // 1
    const status = await userStore.getUserState();
    expect(status).toBe(USER_STATE.UN_LOGIN);

    // 2
    await userStore.fetchUserInfoByCode("xxx");
    const status1 = await userStore.getUserState();
    expect(status1).toBe(USER_STATE.UN_SETTING);

    // 3
    await userStore.setUserInfo({
      username: "aaa",
      logo: "xxx",
      description: "xxx",
    });
    const status2 = await userStore.getUserState();
    expect(status2).toBe(USER_STATE.DONE);

    // 4
    await userStore.logout();
    const status3 = await userStore.getUserState();
    expect(status3).toBe(USER_STATE.UN_LOGIN);
  });

  it("setUserInfo_", async () => {
    initializeMockUser();
    const userStore = useUserStore();
    const userInfo = computed(() => userStore.userInfo);
    const hasUserInfo = computed(() => userStore.hasUserInfo);

    // 1
    await userStore.fetchUserInfoByCode("xxx");
    await userStore.setUserInfo({
      username: "aaa",
      logo: "xxx",
      description: "xxx",
    });
    expect(userInfo.value.username).toBe("aaa");
    expect(userInfo.value.logo).toBe("xxx");
    expect(userInfo.value.description).toBe("xxx");
    expect(hasUserInfo.value).toBe(true);
  });

  it("logout", async () => {
    initializeMockUser();
    const userStore = useUserStore();
    const userInfo = computed(() => userStore.userInfo);
    const hasUserInfo = computed(() => userStore.hasUserInfo);

    // 1
    await userStore.fetchUserInfoByCode("xxx");
    await userStore.setUserInfo({
      username: "aaa",
      logo: "xxx",
      description: "xxx",
    });
    await userStore.logout();
    expect(userInfo.value).toEqual({});
    expect(hasUserInfo.value).toBe(false);
  });
});
