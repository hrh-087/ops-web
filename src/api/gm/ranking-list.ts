import request from "@/utils/request";
import { type APIResponse, ResponseList } from "../types/common";
import internal from "stream";

class GmRankingListApi {
  static getSwitchList(data: any) {
    return request<any, APIResponse<object>>({
      url: "/gm/getSwitchList/",
      method: "post",
      data,
    });
  }

  static setSwitch(data: any) {
    return request<any, APIResponse<object>>({
      url: "/gm/setSwitch/",
      method: "post",
      data,
    });
  }
}

export default GmRankingListApi;

export interface GmRankingList {
  id: number;
  name: string;
  rankType: number;
  desc: string;
}

export interface RankingForm {
  id: string;
  name?: string;
  startTime: string;
  endTime: string;
  awardList: RankingListAward[];
}

export interface RankingListAward {
  id: string;
  name: string;
  num: number;
}
