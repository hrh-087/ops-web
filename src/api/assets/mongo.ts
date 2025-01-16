import request from '@/utils/request';
import { type APIResponse, ResponseList } from "../types/common";

class AssetsMongoApi{  
  static getAssetsMongoList(data: any) {
    return request<any, APIResponse<ResponseList>>({
      url: '/assets/mongo',
      method: 'get',
      params: data,
    });
  }

  static createAssetsMongo(data: any) {
    return request<any, APIResponse<object>>({
      url: '/assets/mongo',
      method: 'post',
      data,
    });
  }

  static updateAssetsMongo(data: any) {
    return request<any, APIResponse<object>>({
      url: '/assets/mongo',
      method: 'put',
      data,
    });
  }

  static deleteAssetsMongo(data: any) {
    return request<any, APIResponse<object>>({
      url: '/assets/mongo',
      method: 'delete',
      data,
    });
  }

  static getAssetsMongoById(id: any) {
    return request<any, APIResponse<object>>({
      url: `/assets/mongo/${id}/`,
      method: 'get',
    });
  }

  static getAssetsMongoall(data: any) {
    return request<any, APIResponse<object>>({
      url: "/assets/mongo/all",
      method: 'get',
      params: data
    });
  }
}

export default AssetsMongoApi;