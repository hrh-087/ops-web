import request from "@/utils/request";
import { type APIResponse, ResponseList } from "../types/common";
import { type GameType } from "./gameType";
import { type AssetsServer } from "../assets/server";
import { type Platform } from "../game-config/platform";

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

  static updateGameConfig(data: any) {
    return request<any, APIResponse<object>>({
      url: "/game/server/updateConfig/",
      method: "post",
      data,
    });
  }

  static RsyncGameConfig(data: any) {
    return request<any, APIResponse<object>>({
      url: "/game/server/rsyncConfig/",
      method: "post",
      data,
    });
  }

  static execGameTask(data: any) {
    return request<any, APIResponse<object>>({
      url: "/game/server/execTask/",
      method: "post",
      data,
    });
  }
}

export default GameServerApi;

export interface GameServer {
  composeFile: string;
  configFile: string;
  CreatedAt: string;
  gameType: GameType;
  gameTypeId: number;
  grpcPort: number;
  host: AssetsServer;
  hostId: number;
  httpPort: number;
  ID: number;
  kafkaId: number;
  mongoId: number;
  name: string;
  platform: Platform;
  platformId: number;
  projectId: number;
  redisId: number;
  status: number;
  tcpPort: number;
  UpdatedAt: string;
  vmid: number;
  [property: string]: any;
}
