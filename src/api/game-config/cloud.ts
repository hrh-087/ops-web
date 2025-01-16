import request from '@/utils/request';
import { APIResponse, ResponseList } from '../types/common';

class CloudProduceApi {

  static getCloudProduceList(data: any) {
    return request<any, APIResponse<ResponseList>>({
      url: "/cloud/cloudProduce",
      method: "get",
      params: data,
    });
  }

  static getCloudProduceById(id: any) {
    return request<any, APIResponse<object>>({
      url: `/cloud/cloudProduce/${id}/`,
      method: "get"
    });
  }

  static createCloudProduce(data: any) {
    return request<any, APIResponse<object>>({
      url: "/cloud/cloudProduce",
      method: "post",
      data,
    });
  }

  static updateCloudProduce(data: any) {
    return request<any, APIResponse<object>>({
      url: "/cloud/cloudProduce",
      method: "put",
      data,
    });
  }

  static deleteCloudProduce(data: any) {
    return request<any, APIResponse<object>>({
      url: "/cloud/cloudProduce",
      method: "delete",
      data,
    });
  }

  static getCloudProduceAll() {
    return request<any, APIResponse<object>>({
      url: "/cloud/cloudProduce/all/",
      method: "get",
    });
  }
}

export default CloudProduceApi;