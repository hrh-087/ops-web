import request from "@/utils/request";
import { type RequestList, ResponseList, APIResponse, APIResponseList } from "@/api/types/common";

class MenuAPI {
  /**
   * 获取当前用户的路由列表
   * <p/>
   * 无需传入角色，后端解析token获取角色自行判断是否拥有路由的权限
   *
   * @returns 路由列表
   */
  static getRoutes() {
    return request<any, APIResponse<RouteVO[]>>({
      url: "/menu/getMenu",
      method: "post",
      // url: "/api/v1/menus/routes",
      // method: "get",
    });
  }

  static getMenuList(data: RequestList) {
    return request<any, APIResponse<ResponseList>>({
      url: "/menu/getMenuList ",
      method: "post",
      data: data
    });
  }
  

  // @Summary 修改menu列表
  // @Produce  application/json
  // @Param menu Object
  // @Router /menu/updateBaseMenu [post]
  static updateBaseMenu(data:any) {
    return request<any,APIResponse<object>>({
      url: '/menu/updateBaseMenu',
      method: 'post',
      data
    })
  }

  // @Summary 新增基础menu
  // @Produce  application/json
  // @Param menu Object
  // @Router /menu/getMenuList [post]
  static addBaseMenu(data:any) {
    return request<any,APIResponse<object>>({
      url: '/menu/addBaseMenu',
      method: 'post',
      data
    })
  }

  // @Summary 删除基础menu
  // @Produce  application/json
  // @Param menu Object
  // @Router /menu/getMenuList [post]
  static deleteBaseMenu(data:any) {
    return request<any,APIResponse<any>>({
      url: '/menu/deleteBaseMenu',
      method: 'post',
      data
    })
  }

  // @Tags menu
  // @Summary 根据id获取菜单
  // @Security ApiKeyAuth
  // @accept application/json
  // @Produce application/json
  // @Param data body api.GetById true "根据id获取菜单"
  // @Success 200 {string} json "{"success":true,"data":{},"msg":"获取成功"}"
  // @Router /menu/getBaseMenuById [post]
  static getBaseMenuById(data: object) {
    return request<any, APIResponse<object>>({
      url: '/menu/getBaseMenuById',
      method: 'post',
      data
    })
  }

// @Summary 获取基础路由列表
// @Produce  application/json
// @Param 可以什么都不填 调一下即可
// @Router /menu/getBaseMenuTree [post]
static getBaseMenuTree = () => {
  return request<APIResponseList<never[]>>({
    url: '/menu/getBaseMenuTree',
    method: 'post'
  })
}

static getMenuAuthority = (data:object) => {
  return request<MenuAuthority>({
    url: '/menu/getMenuAuthority',
    data: data,
    method: 'post'
  })
}

static addMenuAuthority(data:object) {
  return request<any,APIResponse<object>>({
    url: '/menu/addMenuAuthority',
    method: 'post',
    data
  })
}

}

export default MenuAPI;

export interface MenuAuthority{
  menus: never[];
}

/** RouteVO，路由对象 */
export interface RouteVO {
  /** 子路由列表 */
  children: RouteVO[];
  /** 组件路径 */
  component?: string;
  /** 路由属性 */
  meta?: Meta;
  /** 路由名称 */
  name?: string;
  /** 路由路径 */
  path?: string;
  /** 跳转链接 */
  redirect?: string;
}

/** Meta，路由属性 */
export interface Meta {
  /** 【目录】只有一个子路由是否始终显示 */
  alwaysShow?: boolean;
  /** 是否隐藏(true-是 false-否) */
  hidden?: boolean;
  /** ICON */
  icon?: string;
  /** 【菜单】是否开启页面缓存 */
  keepAlive?: boolean;
  /** 路由title */
  title?: string;
}

