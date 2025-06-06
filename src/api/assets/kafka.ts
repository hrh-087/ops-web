import request from "@/utils/request";
import { type APIResponse, ResponseList, DeviceInfo } from "../types/common";
import { Platform } from "../game-config/platform";

class AssetsKafkaApi {
  static getAssetsKafkaList(data: any) {
    return request<any, APIResponse<ResponseList>>({
      url: "/assets/kafka/",
      method: "get",
      params: data,
    });
  }

  static createAssetsKafka(data: any) {
    return request<any, APIResponse<object>>({
      url: "/assets/kafka/",
      method: "post",
      data,
    });
  }

  static updateAssetsKafka(data: any) {
    return request<any, APIResponse<object>>({
      url: "/assets/kafka/",
      method: "put",
      data,
    });
  }

  static deleteAssetsKafka(data: any) {
    return request<any, APIResponse<object>>({
      url: "/assets/kafka/",
      method: "delete",
      data,
    });
  }

  static getAssetsKafkaById(id: any) {
    return request<any, APIResponse<object>>({
      url: `/assets/kafka/${id}/`,
      method: "get",
    });
  }

  static getAssetsKafkaall(data: any) {
    return request<any, APIResponse<object>>({
      url: "/assets/kafka/all/",
      method: "get",
      params: data,
    });
  }
}

export default AssetsKafkaApi;

export interface AssetsKafka {
  CreatedAt: string;
  deviceInfo: DeviceInfo;
  host: string;
  ID: number;
  name: string;
  pass: string;
  platform: Platform;
  platformId: number;
  projectId: number;
  UpdatedAt: string;
  user: string;
  [property: string]: any;
}
