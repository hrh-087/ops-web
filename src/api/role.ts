import request from "@/utils/request";
import { APIResponse } from "./types/common";

class AuthorityApi {

  // 获取角色列表
  static getRoleList(data:object) {
    return request<any, APIResponse<AuthorityList<never[]>>>({
      url: "/authority/getAuthorityList",
      data: data,
      method: "post",
    });
  }

  // 添加角色
  static createAuthority(data:object) {
    return request<any, APIResponse<object>>({
      url: "/authority/createAuthority",
      data: data,
      method: "post",
    });
  }

  // 删除角色
  static deleteAuthority(data:object) {
    return request<any, APIResponse<object>>({
      url: "/authority/deleteAuthority",
      data: data,
      method: "post",
    });
  }

  // 复制角色
  static copyAuthority(data:object) {
    return request<any, APIResponse<object>>({
      url: "/authority/copyAuthority",
      data: data,
      method: "post",
    });
  }

  // 更新角色
  static updateAuthority(data:object) {
    return request<any, APIResponse<object>>({
      url: "/authority/updateAuthority",
      data: data,
      method: "put",
    });
  }
}

export interface AuthorityList<T> {
  rows: T
  total: number
  page: number
  pageSize: number
}

export default AuthorityApi

export interface AuthorityInfo {
  authorityId: number;
  authorityName: string;
  parentId: number;
  dataAuthorityId: number | null;
  children: AuthorityInfo[] | null;
  menus: any[] | null;
  defaultRouter: string;
}