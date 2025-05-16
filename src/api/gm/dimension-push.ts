import request from "@/utils/request";
import { type APIResponse, ResponseList } from "../types/common";

class GmDimensionPushApi {
  static dimensionPush(data: any) {
    return request<any, APIResponse<object>>({
      url: "/gm/dimensionPush/",
      method: "post",
      data,
    });
  }
}

export default GmDimensionPushApi;
