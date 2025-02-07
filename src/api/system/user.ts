import request from "@/utils/request";
import { type APIResponse } from "../types/common";
import { type AuthorityInfo } from "./role";

class UserAPI {
  /**
   * 获取当前登录用户信息
   *
   * @returns 登录用户昵称、头像信息，包括角色和权限
   */
  static getInfo() {
    return request<any, APIResponse<UserInfo>>({
      url: "/user/getUserinfo/",
      method: "get",
    });
  }
  /** 注销 接口*/
  static logout() {
    return request({
      url: "/base/logout/",
      method: "post",
    });
  }

  /** 登录 接口*/
  static login(data: LoginData) {
    // const formData = new FormData();
    // formData.append("username", data.username);
    // formData.append("password", data.password);
    // formData.append("captchaKey", data.captchaKey);
    // formData.append("captchaCode", data.captchaCode);
    return request<any, APIResponse<LoginResult>>({
      url: "/base/login/",
      method: "post",
      data: data,
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
    });
  }

  /** 注册 接口*/
  static register(data: object) {
    return request<any, APIResponse<object>>({
      url: "/user/register/",
      method: "post",
      data,
    });
  }

  /**更新用户信息 */
  static setUserInfo(data: object) {
    return request<any, APIResponse<object>>({
      url: "/user/setUserInfo/",
      method: "put",
      data,
    });
  }

  /**
   * 获取用户列表
   *
   * @param params 查询参数
   * @returns 用户列表
   */
  static getUserList(data: any) {
    return request<any, APIResponse<any>>({
      url: "/user/getUserList/",
      method: "post",
      data,
    });
  }

  // 设置一个角色
  static setUserAuthorities(data: any) {
    return request<any, APIResponse<any>>({
      url: "/user/setUserAuthorities/",
      method: "post",
      data,
    });
  }

  // 设置用户权限
  static setUserAuthority(data: object) {
    return request<any, APIResponse<any>>({
      url: "/user/setUserAuthority/",
      method: "post",
      data,
    });
  }

  static setUserProject(data: object) {
    return request<any, APIResponse<object>>({
      url: "/user/setUserProject/",
      method: "post",
      data,
    });
  }

  // 删除角色
  static deleteUser(data: object) {
    return request<any, APIResponse<object>>({
      url: "/user/deleteUser/",
      method: "delete",
      data,
    });
  }

  // 重置密码
  static resetPassword(data: object) {
    return request<any, APIResponse<object>>({
      url: "/user/resetPassword/",
      method: "post",
      data,
    });
  }

  // 修改密碼
  static changePassword(data: object) {
    return request<any, APIResponse<object>>({
      url: "/user/changePassword/",
      method: "post",
      data,
    });
  }

  // 修改用戶自身信息
  static setSelfInfo(data: object) {
    return request<any, APIResponse<object>>({
      url: "/user/setSelfInfo/",
      method: "put",
      data,
    });
  }
}

export default UserAPI;

/** 登录用户信息 */
export interface UserInfo {
  /** 用户ID */
  uuid?: number;

  /** 用户名 */
  username?: string;

  /** 昵称 */
  nickname?: string;

  /** 头像URL */
  avatar?: string;

  /** 角色 */
  authority: AuthorityInfo;

  /** 角色列表 */
  authorities: AuthorityInfo[];

  phone: string;

  email: string;

  projectId: number;

  /** 权限 */
  // perms: string[];
}

/** 登录请求参数 */
export interface LoginData {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  // /** 验证码缓存key */
  // captchaKey: string;
  // /** 验证码 */
  // captchaCode: string;
}

/** 登录响应 */
export interface LoginResult {
  /** 访问token */
  token?: string;
  /** 过期时间(单位：毫秒) */
  expiresAt?: number;
  /** 用户信息 */
  user?: object;
}
