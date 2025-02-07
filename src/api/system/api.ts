import request from "@/utils/request";
import { APIResponse, ResponseList } from "../types/common";

class ApiAPI {
  static getApiList(data: any) {
    return request<any, APIResponse<ResponseList>>({
      url: "/api/getApiList/",
      method: "post",
      data: data,
    });
  }

  static createApi(data: any) {
    return request<any, APIResponse<object>>({
      url: "/api/createApi/",
      method: "post",
      data: data,
    });
  }

  static getApiGroups() {
    return request<any, APIResponse<never[]>>({
      url: "/api/getApiGroups/",
      method: "get",
    });
  }

  static editApi(data: object) {
    return request<any, APIResponse<object>>({
      url: "/api/updateApi/",
      method: "post",
      data: data,
    });
  }

  // 刷新缓存
  static freshApi() {
    return request<any, APIResponse<object>>({
      url: "/api/freshCasbin/",
      method: "get",
    });
  }

  static deleteApi(data: object) {
    return request<any, APIResponse<object>>({
      url: "/api/deleteApi/",
      method: "post",
      data: data,
    });
  }

  static getApiById(data: object) {
    return request<any, APIResponse<object>>({
      url: "/api/getApiById/",
      method: "post",
      data: data,
    });
  }

  static deleteApisByIds(data: object) {
    return request<any, APIResponse<object>>({
      url: "/api/deleteApisByIds/",
      method: "delete",
      data: data,
    });
  }

  static getAllApis() {
    return request<any, APIResponse<never[]>>({
      url: "/api/getAllApis/",
      method: "post",
    });
  }
}

export default ApiAPI;
