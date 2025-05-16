import request from "@/utils/request";
import { APIResponse, ResponseList } from "../types/common";

class TaskApi {
  static getTaskResult(data: any) {
    return request<any, APIResponse<object>>({
      url: "/job/task/result/",
      method: "post",
      data,
    });
  }

  static getTaskList(data: any) {
    return request<any, APIResponse<ResponseList>>({
      url: "/job/task/",
      method: "get",
      params: data,
    });
  }
}

export default TaskApi;
