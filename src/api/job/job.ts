import request from '@/utils/request';
import { APIResponse, ResponseList } from '../types/common';

class JobApi {
  static getJobList(data: any) {
    return request<any, APIResponse<ResponseList>>({
      url: '/job/',
      method: 'get',
      params: data,
    })
  }

  static getJobById(data: any) {
    return request<any, APIResponse<object>>({
      url: '/job/info/',
      method: 'post',
      data
    })
  }
}

export default JobApi;