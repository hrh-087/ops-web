import request from '@/utils/request';
import { type APIResponse, ResponseList } from "../types/common";

class AssetsServerApi{
  static getAssetsServerList(data: any) {
    return request<any, APIResponse<ResponseList>>({
      url: '/assets/server',
      method: 'get',
      params: data,
    });
  }

  static createAssetsServer(data: any) {
    return request<any, APIResponse<object>>({
      url: '/assets/server',
      method: 'post',
      data,
    });
  }

  static updateAssetsServer(data: any) {
    return request<any, APIResponse<object>>({
      url: '/assets/server',
      method: 'put',
      data,
    });
  }

  static deleteAssetsServer(data: any) {
    return request<any, APIResponse<object>>({
      url: '/assets/server',
      method: 'delete',
      data,
    });
  }

  static getAssetsServerById(id: any) {
    return request<any, APIResponse<object>>({
      url: `/assets/server/${id}/`,
      method: 'get',
    });
  }

  static getAssetsServerall(data: any) {
    return request<any, APIResponse<object>>({
      url: "/assets/server/all",
      method: 'get',
      params: data
    });
  }
}

export default AssetsServerApi;