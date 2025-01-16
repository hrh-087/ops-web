import request from "@/utils/request";
import { APIResponse, ResponseList } from "../types/common";

class CommandApi {
  static getCommandList(data: any) {
    return request<any, APIResponse<ResponseList>>({
      url: "/job/command/",
      method: "get",
      params: data,
    });
  }

  static createCommand(data: any) {
    return request<any, APIResponse<object>>({
      url: "/job/command/",
      method: "post",
      data,
    });
  }

  static updateCommand(data: any) {
    return request<any, APIResponse<object>>({
      url: "/job/command/",
      method: "put",
      data,
    });
  }

  static deleteCommand(data: any) {
    return request<any, APIResponse<object>>({
      url: "/job/command/",
      method: "delete",
      data,
    });
  }

  static getCommandById(id: any) {
    return request<any, APIResponse<Command>>({
      url: `/job/command/${id}/`,
      method: "get",
    });
  }

  static getCommandBatchAll() {
    return request<any, APIResponse<Command[]>>({
      url: `/job/command/all/`,
      method: "get",
    });
  }

  static execBatchCommand(data: any) {
    return request<any, APIResponse<object>>({
      url: `/job/command/batchCommand/`,
      method: "post",
      data,
    });
  }
}

export default CommandApi;

export interface Command {
  /**
   * 需要执行的命令
   */
  command: string;
  /**
   * 命令类型
   */
  commandType?: number;
  /**
   * 描述
   */
  description?: string;
  /**
   * 命令名称
   */
  name: string;
  /**
   * 是否允许批量执行
   */
  useBatch?: boolean;
  [property: string]: any;
}
