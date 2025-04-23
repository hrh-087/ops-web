import request from "@/utils/request";
import { type APIResponse, ResponseList } from "../types/common";

class GmImportPlayerApi {
  static getAccountInfo(data: any) {
    return request<any, APIResponse<object>>({
      url: "/gm/getAccountInfo/",
      method: "post",
      data,
    });
  }

  static importPlayerData(data: any) {
    return request<any, APIResponse<object>>({
      url: "/gm/importPlayerData/",
      method: "post",
      data,
    });
  }
}

export default GmImportPlayerApi;
