import request from "@/utils/request";
import { APIResponse, ResponseList } from "../types/common";

class CasbinApi {
  // 根据角色id获取权限
  static getPolicyPathByAuthorityId(data: object) {
    return request<any, APIResponse<never[]>>({
      url: "/casbin/getPolicyPathByAuthorityId/",
      method: "post",
      data,
    });
  }

  // 更新角色权限
  static updateCasbin(data: any) {
    console.log("data:", data);
    return request<any, APIResponse<object>>({
      url: "/casbin/updateCasbin/",
      method: "post",
      data,
    });
  }
}

export default CasbinApi;
