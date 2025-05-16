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

export interface OperationRecord {
  agent: string;
  body: string;
  CreatedAt: string;
  error_message: string;
  ID: number;
  ip: string;
  latency: number;
  method: string;
  path: string;
  resp: string;
  status: number;
  UpdatedAt: string;
  user: User;
  user_id: number;
  "01JKFWENQXKZG19NNNFKWBWAX4": any;
  [property: string]: any;
}
