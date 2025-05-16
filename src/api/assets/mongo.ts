import request from "@/utils/request";
import { type APIResponse, ResponseList, DeviceInfo } from "../types/common";
import { Platform } from "../game-config/platform";

class AssetsMongoApi {
  static getAssetsMongoList(data: any) {
    return request<any, APIResponse<ResponseList>>({
      url: "/assets/mongo/",
      method: "get",
      params: data,
    });
  }

  static createAssetsMongo(data: any) {
    return request<any, APIResponse<object>>({
      url: "/assets/mongo/",
      method: "post",
      data,
    });
  }

  static updateAssetsMongo(data: any) {
    return request<any, APIResponse<object>>({
      url: "/assets/mongo/",
      method: "put",
      data,
    });
  }

  static deleteAssetsMongo(data: any) {
    return request<any, APIResponse<object>>({
      url: "/assets/mongo/",
      method: "delete",
      data,
    });
  }

  static getAssetsMongoById(id: any) {
    return request<any, APIResponse<object>>({
      url: `/assets/mongo/${id}/`,
      method: "get",
    });
  }

  static getAssetsMongoall(data: any) {
    return request<any, APIResponse<object>>({
      url: "/assets/mongo/all/",
      method: "get",
      params: data,
    });
  }
}

export default AssetsMongoApi;

export interface AssetsMongo {
  auth: string;
  CreatedAt: string;
  deviceInfo: DeviceInfo;
  host: string;
  ID: number;
  name: string;
  platform: Platform;
  platformId: number;
  projectId: number;
  UpdatedAt: string;
  [property: string]: any;
}
