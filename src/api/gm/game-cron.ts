import request from "@/utils/request";
import { type APIResponse, ResponseList } from "../types/common";

class GmGameCronApi {
  static getGameCronList(data: any) {
    return request<any, APIResponse<ResponseList>>({
      url: "/gm/getGameCronList/",
      method: "post",
      data,
    });
  }

  static setGameCron(data: any) {
    return request<any, APIResponse<object>>({
      url: "/gm/setGameCron/",
      method: "post",
      data,
    });
  }

  static getActivityExtra(data: any) {
    return request<any, APIResponse<object>>({
      url: "/gm/getActivityExtra/",
      method: "post",
      data,
    });
  }
}

export default GmGameCronApi;

export interface GmCron {
  serverId: number;
  cron: string;
  key: string;
  activityExtra: object;
}
