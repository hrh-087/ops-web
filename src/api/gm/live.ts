import request from "@/utils/request";
import { type APIResponse, ResponseList } from "../types/common";

class GmLiveApi {
  static getLiveServerList(data: any) {
    return request<any, APIResponse<ResponseList>>({
      url: "/gm/getLiveServerList/",
      method: "post",
      data,
    });
  }

  static kickLivePlayer(data: any) {
    return request<any, APIResponse<object>>({
      url: "/gm/kickLivePlayer/",
      method: "post",
      data: data,
    });
  }

  static clearLiveServer(data: any) {
    return request<any, APIResponse<object>>({
      url: "/gm/clearLiveServer/",
      method: "post",
      data: data,
    });
  }

  static setLiveServer(data: any) {
    return request<any, APIResponse<object>>({
      url: "/gm/setLiveServer/",
      method: "post",
      data: data,
    });
  }
}

export default GmLiveApi;

export interface GameLive {
  endTime: null;
  homeowner: number[];
  id: number;
  member: number[];
  nameForTQT: string;
  number: number;
  startTime: null;
  updateTime?: null;
  [property: string]: any;
}
