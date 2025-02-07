import request from "@/utils/request";
import { type APIResponse, ResponseList } from "../types/common";
import { type CloudProduce } from "../game-config/cloud";
import { type Platform } from "../game-config/platform";

class LbApi {
  static rsyncAssetsLb(data: any) {
    return request<any, APIResponse<object>>({
      url: "/assets/lb/rsyncCloud/",
      method: "post",
      data,
    });
  }

  static getAssetsLbList(data: any) {
    return request<any, APIResponse<ResponseList>>({
      url: "/assets/lb/",
      method: "get",
      params: data,
    });
  }

  static deleteAssetsLb(data: any) {
    return request<any, APIResponse<object>>({
      url: "/assets/lb/",
      method: "delete",
      data: data,
    });
  }

  static getAssetsLbById(id: any) {
    return request<any, APIResponse<Lb>>({
      url: "/assets/lb/" + id + "/",
      method: "get",
    });
  }

  static rsyncLbListener() {
    return request<any, APIResponse<object>>({
      url: "/assets/lb/rsyncLbListener/",
      method: "post",
    });
  }

  static writeRedis() {
    return request<any, APIResponse<object>>({
      url: "/assets/lb/writeRedis/",
      method: "post",
    });
  }
}

export default LbApi;

// 负载均衡
export interface Lb {
  cloudProduce: CloudProduce;
  cloudProduceId: number;
  subnetCidrId: string;
  ID: number;
  instanceId: string;
  level: number;
  listener: LbListener[];
  name: string;
  platform: Platform;
  platformId: number;
  privateIp: string;
  projectId: number;
  pubIp: string;
}
// 监听器
export interface LbListener {
  ID: number;
  instanceId: string;
  name: string;
  port: number;
  protocal: string;
}
