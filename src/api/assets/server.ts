import request from "@/utils/request";
import { type APIResponse, ResponseList, DeviceInfo } from "../types/common";
import { type CloudProduce } from "../game-config/cloud";
import { type Platform } from "../game-config/platform";

class AssetsServerApi {
  static getAssetsServerList(data: any) {
    return request<any, APIResponse<ResponseList>>({
      url: "/assets/server/",
      method: "get",
      params: data,
    });
  }

  static createAssetsServer(data: any) {
    return request<any, APIResponse<object>>({
      url: "/assets/server/",
      method: "post",
      data,
    });
  }

  static updateAssetsServer(data: any) {
    return request<any, APIResponse<object>>({
      url: "/assets/server/",
      method: "put",
      data,
    });
  }

  static deleteAssetsServer(data: any) {
    return request<any, APIResponse<object>>({
      url: "/assets/server/",
      method: "delete",
      data,
    });
  }

  static getAssetsServerById(id: any) {
    return request<any, APIResponse<object>>({
      url: `/assets/server/${id}/`,
      method: "get",
    });
  }

  static getAssetsServerall(data: any) {
    return request<any, APIResponse<object>>({
      url: "/assets/server/all/",
      method: "get",
      params: data,
    });
  }

  static generateMonitorFile() {
    return request<any, APIResponse<object>>({
      url: "/assets/server/generatePrometheusHostConfig/",
      method: "post",
    });
  }

  static pullCloudInfo(data: any) {
    return request<any, APIResponse<object>>({
      url: "/assets/server/pullInstanceCloudInfo/",
      method: "post",
      data,
    });
  }
}

export default AssetsServerApi;

export interface AssetsServer {
  cloudProduce: CloudProduce;
  cloudProduceId: number;
  CreatedAt: string;
  deviceInfo: DeviceInfo;
  ID: number;
  instanceId: string;
  instanceStates: number;
  platform: Platform;
  platformId: number;
  ports: string[];
  privateIp: string;
  projectId: number;
  pubIp: string;
  serverName: string;
  serverType: number;
  sshPort: string;
  status: number;
  UpdatedAt: string;
  uuid: string;
  vpcId: string;
  subVpcId: string;
  [property: string]: any;
}
