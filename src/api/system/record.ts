import request from "@/utils/request";
import { type APIResponse, ResponseList } from "../types/common";

class RecordAPI {
  static getRecordList(data: any) {
    return request<any, APIResponse<ResponseList>>({
      url: "/system/record/",
      method: "get",
      params: data,
    });
  }

  static deleteRecordById(data: any) {
    return request<any, APIResponse<object>>({
      url: `/system/record/`,
      method: "delete",
      data,
    });
  }

  // 批量删除
  static deleteRecordBatch(data: any) {
    return request<any, APIResponse<object>>({
      url: `/system/record/batch/`,
      method: "delete",
      data,
    });
  }
}

export default RecordAPI;
