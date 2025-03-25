import request from "@/utils/request";
import { APIResponse, ResponseList } from "../types/common";

class CronTaskApi {
  static getCronTaskList(data: any) {
    return request<any, APIResponse<ResponseList>>({
      url: "/job/cron/",
      method: "get",
      params: data,
    });
  }

  static createCronTask(data: any) {
    return request<any, APIResponse<CronTask>>({
      url: "/job/cron/",
      method: "post",
      data: data,
    });
  }

  static updateCronTask(data: any) {
    return request<any, APIResponse<CronTask>>({
      url: "/job/cron/",
      method: "put",
      data: data,
    });
  }

  static deleteCronTask(data: any) {
    return request<any, APIResponse<CronTask>>({
      url: "/job/cron/",
      method: "delete",
      data: data,
    });
  }

  static getCronTaskById(id: any) {
    return request<any, APIResponse<CronTask>>({
      url: "/job/cron/" + id + "/",
      method: "get",
    });
  }

  static execCronTask(data: any) {
    return request<any, APIResponse<CronTask>>({
      url: "/job/cron/exec/",
      method: "post",
      data: data,
    });
  }
}

export default CronTaskApi;

export interface CronTask {
  createdAt: string;
  creator: string;
  cronRule: string;
  cronTaskId: string;
  describe: string;
  execTime: string;
  name: string;
  projectId: number;
  status: number;
  taskId: string;
  tasks: string[];
  taskTypeName: string;
  type: number;
  updatedAt: string;
  [property: string]: any;
}

export interface CronTaskForm {
  cronRule?: string;
  describe?: string;
  execTime?: Date;
  name?: string;
  type?: number;
  taskTypeName?: string;
  status?: number;
}
