import request from "@/utils/request";
import { APIResponse, ResponseList } from "../types/common";

class ProjectApi {
  static getProjectList(data: any) {
    return request<any, APIResponse<ResponseList>>({
      url: "/project/getProjectList/",
      method: "post",
      data,
    });
  }

  static createProject(data: any) {
    return request<any, APIResponse<object>>({
      url: "/project/createProject/",
      method: "post",
      data,
    });
  }

  static updateProject(data: any) {
    return request<any, APIResponse<object>>({
      url: "/project/updateProject/",
      method: "post",
      data,
    });
  }

  static deleteProject(data: any) {
    return request<any, APIResponse<object>>({
      url: "/project/deleteProject/",
      method: "delete",
      data,
    });
  }

  static getProjectById(data: any) {
    return request<any, APIResponse<object>>({
      url: "/project/getProjectById/",
      method: "post",
      data: data,
    });
  }

  static getBaseProjectTree() {
    return request<any, APIResponse<never[]>>({
      url: "/project/getBaseProjectTree/",
      method: "get",
    });
  }

  static getAntuorityProject(data: object) {
    return request<any, APIResponse<never[]>>({
      url: "/project/getAuthorityProject/",
      method: "post",
      data: data,
    });
  }

  static addProjectAuthority(data: object) {
    return request<any, APIResponse<object>>({
      url: "/project/setAuthorityProject/",
      method: "post",
      data: data,
    });
  }

  static initProject(data: object) {
    return request<any, APIResponse<object>>({
      url: "/project/initProject/",
      method: "post",
      data: data,
    });
  }
}

export default ProjectApi;

export interface ProjectInfo {
  ID: number;
  projectName: string;
}
