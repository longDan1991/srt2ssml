import { createApp } from "vue";

export const withSetup = (composable) => {
  let result;
  const app = createApp({
    setup() {
      result = composable();
      return () => {};
    },
  });
  app.mount(document.createElement("div"));
  return [result, app];
};

export const mockSuccessResponse = (data) => {
  return {
    code: 200,
    message: "Success!",
    errorCode: 200,
    errorName: "Success!",
    data,
  };
};
