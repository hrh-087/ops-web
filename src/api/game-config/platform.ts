import request from "@/utils/request";
import { APIResponse, ResponseList } from "../types/common";

class PlatformApi {
  static getPlatformList(data: any) {
    return request<any, APIResponse<ResponseList>>({
      url: "/platform/gamePlatform/",
      method: "get",
      params: data,
    });
  }

  static createPlatform(data: any) {
    return request<any, APIResponse<object>>({
      url: "/platform/gamePlatform/",
      method: "post",
      data,
    });
  }

  static updatePlatform(data: any) {
    return request<any, APIResponse<object>>({
      url: "/platform/gamePlatform/",
      method: "put",
      data,
    });
  }

  static deletePlatform(data: any) {
    return request<any, APIResponse<object>>({
      url: "/platform/gamePlatform/",
      method: "delete",
      data,
    });
  }

  static getPlatformById(id: any) {
    return request<any, APIResponse<object>>({
      url: `/platform/gamePlatform/${id}/`,
      method: "get",
    });
  }

  static getPlatformAll() {
    return request<any, APIResponse<object>>({
      url: "/platform/gamePlatform/all/",
      method: "get",
    });
  }

  static kickServer(data: any) {
    return request<any, APIResponse<object>>({
      url: "/platform/gamePlatform/kick/",
      method: "post",
      data,
    });
  }
}

export default PlatformApi;

export interface Platform {
  ID?: number;
  platformCode: string;
  platformDescribe: string;
  platformName: string;
  projectId?: number;
  imageTag: string;
  imageUri: string;

  ltsLogGroupId: string;
  ltsLogStreamId: string;
  cloudRegionId: string;
  cloudProjectId: string;
  cloudSecretId: string;
  cloudSecretKey: string;

  gmUrl: string;
  gatewayUrl: string;
  [property: string]: any;
}
