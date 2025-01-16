import request from '@/utils/request';
import { type APIResponse, ResponseList } from "../types/common";

class AssetsMysqlApi{  
  static getAssetsMysqlList(data: any) {
    return request<any, APIResponse<ResponseList>>({
      url: '/assets/mysql',
      method: 'get',
      params: data,
    });
  }

  static createAssetsMysql(data: any) {
    return request<any, APIResponse<object>>({
      url: '/assets/mysql',
      method: 'post',
      data,
    });
  }

  static updateAssetsMysql(data: any) {
    return request<any, APIResponse<object>>({
      url: '/assets/mysql',
      method: 'put',
      data,
    });
  }

  static deleteAssetsMysql(data: any) {
    return request<any, APIResponse<object>>({
      url: '/assets/mysql',
      method: 'delete',
      data,
    });
  }

  static getAssetsMysqlById(id: any) {
    return request<any, APIResponse<object>>({
      url: `/assets/mysql/${id}/`,
      method: 'get',
    });
  }

  static getAssetsMysqlall(data: any) {
    return request<any, APIResponse<object>>({
      url: "/assets/server/all/",
      method: 'get',
      params: data
    });
  }
}

export default AssetsMysqlApi;