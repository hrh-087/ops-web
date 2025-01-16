import request from "@/utils/request";
import { type APIResponse, ResponseList } from "../types/common";

class GameServerApi {
  static createGameServer(data: any) {
    return request<any, APIResponse<object>>({
      url: "/game/server/",
      method: "post",
      data,
    });
  }

  static deleteGameServer(data: any) {
    return request<any, APIResponse<object>>({
      url: "/game/server/",
      method: "delete",
      data,
    });
  }

  static getGameServerAll() {
    return request<any, APIResponse<object>>({
      url: "/game/server/all/",
      method: "get",
    });
  }

  static getGameServerById(id: any) {
    return request<any, APIResponse<object>>({
      url: "/game/server/" + id + "/",
      method: "get",
    });
  }

  static getGameServerList(data: any) {
    return request<any, APIResponse<ResponseList>>({
      url: "/game/server/",
      method: "get",
      params: data,
    });
  }

  static updateGameServer(data: any) {
    return request<any, APIResponse<object>>({
      url: "/game/server/",
      method: "put",
      data,
    });
  }

  static installGameServer(data: any) {
    return request<any, APIResponse<object>>({
      url: "/game/server/install/",
      method: "post",
      data,
    });
  }
}

export default GameServerApi;
