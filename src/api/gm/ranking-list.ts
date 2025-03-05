import request from "@/utils/request";
import { type APIResponse, ResponseList } from "../types/common";
import internal from "stream";

class GmRankApi {
  static getRankList(data: any) {
    return request<any, APIResponse<object>>({
      url: "/gm/getRankList/",
      method: "post",
      data,
    });
  }

  static getRankRewardList(data: any) {
    return request<any, APIResponse<object>>({
      url: "/gm/getRankRewardList/",
      method: "post",
      data,
    });
  }

  static setRankReward(data: any) {
    return request<any, APIResponse<object>>({
      url: "/gm/setRankReward/",
      method: "post",
      data,
    });
  }
}

export default GmRankApi;

export interface GmRankList {
  /**
   * 结束时间，"2025-02-04 23:59:59"
   */
  endTime: string;
  /**
   * 唯一id
   */
  id: number;
  /**
   * 排行榜id
   */
  rankId: number;
  /**
   * 展示数量
   */
  showCount: number;
  /**
   * 开启时间，"2025-02-03 00:00:00"
   */
  startTime: string;
  [property: string]: any;
}

export interface RankOpenForm {
  id: number; // 唯一id
  rankId: number; // 排行榜id
  showCount: number; // 展示数量
  rankName?: string; // 排行榜名称
  startTime: string; // 开始时间
  endTime: string; // 结束时间
  rewardList: RankRewardForm[];
}

export interface RankRewardForm {
  id: number; // 唯一id
  rankId: number; // 排行榜id
  rank: number; // 排名
  rewards: RankReward[]; // 奖励配置
}

export interface RankReward {
  // id: number; // 唯一id 对应RankRewardForm的唯一id
  rewardId: string; // 奖励id
  rewardName: string; // 奖励名称
  rewardNum: number; // 奖励数量
}
