import request from "@/utils/request";
import { type APIResponse, ResponseList } from "./types/common";

class BaseApi {
  static uploadFile(formData: FormData) {
    return request<any, APIResponse<any>>({
      url: "/base/uploadFile/",
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  static downloadExcel(data: any) {
    return request<any, APIResponse<any>>({
      url: "/base/generateExcel/",
      method: "get",
      params: data,
      responseType: "blob",
    });
  }
}

export default BaseApi;
