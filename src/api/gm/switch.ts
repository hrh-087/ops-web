import request from "@/utils/request";
import { type APIResponse, ResponseList } from "../types/common";

class GmSwitchApi {
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

export default GmSwitchApi;

export interface GmSwitch {
  serverId?: number;
  state?: boolean;
  typeKey?: string;
  typeName?: string;
  [property: string]: any;
}
