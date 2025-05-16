import request from "@/utils/request";
import { type APIResponse, ResponseList } from "../types/common";

class TaskManageApi {
  static getTaskList(data: any) {
    return request<any, APIResponse<ResponseList>>({
      url: "/job/taskManage/",
      method: "get",
      params: data,
    });
  }

  static getTaskById(id: any) {
    return request<any, APIResponse<object>>({
      url: "/job/taskManage/" + id + "/",
      method: "get",
    });
  }

  static createTask(data: any) {
    return request<any, APIResponse<object>>({
      url: "/job/taskManage/",
      method: "post",
      data,
    });
  }

  static updateTask(data: any) {
    return request<any, APIResponse<object>>({
      url: "/job/taskManage/",
      method: "put",
      data,
    });
  }

  static deleteTask(data: any) {
    return request<any, APIResponse<object>>({
      url: "/job/taskManage/",
      method: "delete",
      data,
    });
  }

  static execTask(data: any) {
    return request<any, APIResponse<object>>({
      url: "/job/taskManage/exec/",
      method: "post",
      data,
    });
  }
}

export default TaskManageApi;

export interface TaskManage {
  CreatedAt?: string;
  ID?: number;
  name: string;
  projectId?: number;
  taskType: string;
  UpdatedAt?: string;
  [property: string]: any;
}
