import { upload } from "./network";

export const uploadToBee = (file) => {
  const data = new FormData();
  data.append("file", file);
  return upload("open-platform-muser/open/muser/upload", data);
};
