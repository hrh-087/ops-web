import request from "@/utils/request";
import { type APIResponse, ResponseList } from "../types/common";

class GameTypeApi {
  static getGameTypeList(data: any) {
    return request<any, APIResponse<ResponseList>>({
      url: "/game/type/",
      method: "get",
      params: data,
    });
  }
  static createGameType(data: any) {
    return request<any, APIResponse<object>>({
      url: "/game/type/",
      method: "post",
      data,
    });
  }

  static updateGameType(data: any) {
    return request<any, APIResponse<object>>({
      url: "/game/type/",
      method: "put",
      data,
    });
  }

  static deleteGameType(data: any) {
    return request<any, APIResponse<object>>({
      url: "/game/type/",
      method: "delete",
      data,
    });
  }

  static getGameTypeById(id: any) {
    return request<any, APIResponse<object>>({
      url: "/game/type/" + id + "/",
      method: "get",
    });
  }

  static getGameTypeAll() {
    return request<any, APIResponse<object>>({
      url: "/game/type/all/",
      method: "get",
    });
  }
}

export default GameTypeApi;

export interface GameType {
  code: string;
  composeTemplate: string;
  configTemplate: string;
  CreatedAt: string;
  grpcPort: string;
  httpPort: string;
  ID: number;
  isFight: boolean;
  name: string;
  projectId: number;
  tcpPort: string;
  UpdatedAt: string;
  vmidRule: number;
  [property: string]: any;
}
