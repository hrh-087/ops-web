import request from "@/utils/request";
import { type APIResponse, ResponseList, DeviceInfo } from "../types/common";
import { type Platform } from "../game-config/platform";

class AssetsMysqlApi {
  static getAssetsMysqlList(data: any) {
    return request<any, APIResponse<ResponseList>>({
      url: "/assets/mysql/",
      method: "get",
      params: data,
    });
  }

  static createAssetsMysql(data: any) {
    return request<any, APIResponse<object>>({
      url: "/assets/mysql/",
      method: "post",
      data,
    });
  }

  static updateAssetsMysql(data: any) {
    return request<any, APIResponse<object>>({
      url: "/assets/mysql/",
      method: "put",
      data,
    });
  }

  static deleteAssetsMysql(data: any) {
    return request<any, APIResponse<object>>({
      url: "/assets/mysql/",
      method: "delete",
      data,
    });
  }

  static getAssetsMysqlById(id: any) {
    return request<any, APIResponse<object>>({
      url: `/assets/mysql/${id}/`,
      method: "get",
    });
  }

  static getAssetsMysqlall(data: any) {
    return request<any, APIResponse<object>>({
      url: "/assets/server/all/",
      method: "get",
      params: data,
    });
  }
}

export default AssetsMysqlApi;

export interface AssetsMysql {
  CreatedAt: string;
  deviceInfo: DeviceInfo;
  host: string;
  ID: number;
  name: string;
  pass: string;
  platform: Platform;
  platformId: number;
  port: number;
  projectId: number;
  UpdatedAt: string;
  user: string;
  [property: string]: any;
}
