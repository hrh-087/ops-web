import request from "@/utils/request";
import { type APIResponse, ResponseList } from "../types/common";

class GmBaseApi {
  static getItemList(data: any) {
    return request<any, APIResponse<object>>({
      url: "/gm/getItemConfigInfo/",
      method: "post",
      data,
    });
  }
}

export default GmBaseApi;

export interface Rank {
  rankId: number;
  rankName: string;
  rankType: number;
}

export interface Item {
  itemId: number;
  itemName: string;
}
