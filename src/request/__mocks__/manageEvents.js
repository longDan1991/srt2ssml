import { mock } from "mockjs";
import { mockSuccessResponse } from "../../helpers/test";

export const statisticsSingleTaskDetail = () => {
  const data = mock({
    "impressionsSum|1-1000000": 1,
    "participantsSum|1-1000000": 1,
    "completedSum|1-1000000": 1,
    "list|1-7": [
      {
        "id|+1": 1,
        "impressions|1-1000000": 1,
        "participants|1-1000000": 1,
        "completed|1-1000000": 1,
      },
    ],
  });
  data.dailyDatas = data.list.map((v) => {
    v.date = `2022-1-${v.id}`;
    return v;
  });
  return mockSuccessResponse(data);
};
