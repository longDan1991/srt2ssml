import { mockSuccessResponse } from "../../helpers/test";

export const mock10006Response = () => {
  return {
    code: 10006,
    message: "Need login first.",
    errorCode: 10006,
    errorName: "Need login first.",
    data: null,
  };
};

class MockUserServer {
  name;
  description;
  logo;
  authed = true;
  isLogin = false;
  getUserInfo = () => {
    if (!this.isLogin) return mock10006Response();
    return mockSuccessResponse({
      muser: {
        _id: "63bccb97ea77a8656dfe5a4c",
        beeUserId: "630c386a366f7d0007457479",
        logo: this.logo,
        username: this.name,
        description: this.description,
        createDate: 1673317271840,
        updateDate: 1673317730745,
      },
      authed: this.authed,
      apps: [
        {
          id: 94,
          manageUserId: "63bccb97ea77a8656dfe5a4c",
          name: "default app",
          logo: null,
          description: null,
          secret: "1a9b30b1f3dd4fc0a5dc525baff6dd89",
          defaultApp: true,
          effect: true,
          createDate: 1673317272000,
          updateDate: 1673317272000,
        },
      ],
    });
  };
  getAuthorizationByCode = (uid) => {
    if (uid) {
      this.isLogin = true;
      return this.getUserInfo();
    }
    return mockSuccessResponse();
  };
  setUserInfo = (data) => {
    this.name = data.username;
    this.description = data.description;
    this.logo = data.logo;
    return mockSuccessResponse();
  };
  logout = () => {
    this.isLogin = false;
    return mockSuccessResponse();
  };
}
let mockUserServer = new MockUserServer();

export const initializeMockUser = () => (mockUserServer = new MockUserServer());

export const getAuthorizationByCode = (uid) => {
  return Promise.resolve(mockUserServer.getAuthorizationByCode(uid));
};

export const fetchUserInfo = () =>
  Promise.resolve(mockUserServer.getUserInfo());

export const setUserInfo = (data) =>
  Promise.resolve(mockUserServer.setUserInfo(data));

export const logout = () => Promise.resolve(mockUserServer.logout());
