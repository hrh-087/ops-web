import request from "@/utils/request";
import { type APIResponse, ResponseList } from "../types/common";

class AssetsRedisApi {
  static getAssetsRedisList(data: any) {
    return request<any, APIResponse<ResponseList>>({
      url: "/assets/redis/",
      method: "get",
      params: data,
    });
  }

  static createAssetsRedis(data: any) {
    return request<any, APIResponse<object>>({
      url: "/assets/redis/",
      method: "post",
      data,
    });
  }

  static updateAssetsRedis(data: any) {
    return request<any, APIResponse<object>>({
      url: "/assets/redis/",
      method: "put",
      data,
    });
  }

  static deleteAssetsRedis(data: any) {
    return request<any, APIResponse<object>>({
      url: "/assets/redis/",
      method: "delete",
      data,
    });
  }

  static getAssetsRedisById(id: any) {
    return request<any, APIResponse<object>>({
      url: `/assets/redis/${id}/`,
      method: "get",
    });
  }

  static getAssetsRedisall(data: any) {
    return request<any, APIResponse<object>>({
      url: "/assets/redis/all/",
      method: "get",
      params: data,
    });
  }
}

export default AssetsRedisApi;
