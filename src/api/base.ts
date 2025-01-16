import request from "@/utils/request";
import { type APIResponse, ResponseList } from "./types/common";

class UploadFileApi {
  static uploadFile(formData: FormData) {
    return request<any, APIResponse<any>>({
      url: "/base/uploadFile",
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export default UploadFileApi;
