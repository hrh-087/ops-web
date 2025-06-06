// List请求
export interface RequestList {
  page: number;
  pageSize: number;
}

// List响应
export interface ResponseList {
  total: number;
  rows: never[];
  page: number;
  pageSize: number;
}

export interface APIResponse<T> {
  code: number;
  data: T;
  msg: string;
}

export interface APIResponseList<T> {
  data: T;
}

export interface DeviceInfo {
  cpuCoreNum: string;
  cpuNum: string;
  cpuTotal: string;
  disk: string;
  mem: string;
  systemOs: string;
  [property: string]: any;
}
