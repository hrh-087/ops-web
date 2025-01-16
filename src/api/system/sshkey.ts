import request from '@/utils/request';
import { APIResponse, ResponseList } from '../types/common';


class SshKeyApi {
  static createSshKey(data:any){
    return request<any, APIResponse<object>>({
      url: '/system/key/',
      method: 'post',
      data,
    })
  }

  static deleteSshKey(data:any){
    return request<any, APIResponse<object>>({
      url: '/system/key/',
      method: 'delete',
      data,
    })
  }

  static getSshKeyList(data:any){
    return request<any, APIResponse<ResponseList>>({
      url: '/system/key/',
      method: 'get',
      params: data,
    })
  }

  static getSshKeyById(id:any){
    return request<any, APIResponse<object>>({
      url: '/system/key/' + id + '/',
      method: 'get',
    })
  }

  static updateSshKey(data:any){
    return request<any, APIResponse<object>>({
      url: '/system/key/',
      method: 'put',
      data,
    })
  }
}

export default SshKeyApi;