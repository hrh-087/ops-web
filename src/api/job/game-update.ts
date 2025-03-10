import request from "@/utils/request";
import { type APIResponse, ResponseList } from "../types/common";

class GameUpdateApi {
  static getGameUpdateList(data: any) {
    return request<any, APIResponse<ResponseList>>({
      url: "/job/gameUpdate/",
      method: "get",
      params: data,
    });
  }

  static createGameUpdate(data: any) {
    return request<any, APIResponse<object>>({
      url: "/job/gameUpdate/",
      method: "post",
      data: data,
    });
  }

  static deleteGameUpdate(data: any) {
    return request<any, APIResponse<object>>({
      url: "/job/gameUpdate/",
      method: "delete",
      data,
    });
  }

  static updateGameUpdate(data: any) {
    return request<any, APIResponse<object>>({
      url: "/job/gameUpdate/",
      method: "put",
      data: data,
    });
  }

  static getGameUpdateById(id: any) {
    return request<any, APIResponse<object>>({
      url: "/job/gameUpdate/" + id + "/",
      method: "get",
    });
  }

  static execUpdateGameTask(data: any) {
    return request<any, APIResponse<object>>({
      url: "/job/gameUpdate/exec/",
      method: "post",
      data: data,
    });
  }

  static getGameSvnConfigInfo() {
    return request<any, APIResponse<object>>({
      url: "/job/gameUpdate/svnInfo/",
      method: "post",
    });
  }
}

export default GameUpdateApi;

/**
 * Request
 */
export interface GameUpdateForm {
  ID?: number;
  /**
   * 游戏版本(正常更新时会检验版本)
   */
  gameVersion?: string;
  /**
   * 热更文件(热更时必传)
   */
  hotFile?: string;
  /**
   * 任务名称
   */
  name: string;
  serverList?: number[];
  /**
   * 热更的服务类型 1 游戏服 2 游戏服类型
   */
  serverType?: number;
  /**
   * 更新类型
   */
  updateType: number;
  /**
   * 热更源文件(热更时必传)
   */
  sourceHotFile?: string;
  hotServerType?: number;
  hotServerList?: string;
  [property: string]: any;
}
