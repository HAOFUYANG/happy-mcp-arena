import request from "../utils/request";

/**
 * 登录请求参数接口
 */
interface LoginRequest {
  contractId: string;
  version: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  metadata: Metadata;
  reviewers?: Reviewer[];
  tags?: string[];
  attachments?: Attachment[];
  settings?: Settings;
}

/**
 * 元数据接口
 */
interface Metadata {
  appVersion: string;
  source: string;
  env: string;
}

/**
 * 审核人员接口
 */
interface Reviewer {
  id: string;
  name: string;
  role: string;
}

/**
 * 附件接口
 */
interface Attachment {
  fileName: string;
  fileUrl: string;
  fileSize: number;
}

/**
 * 设置接口
 */
interface Settings {
  autoApprove: boolean;
  notifyEmails: string[];
  retryLimit: number;
}

/**
 * 契约请求参数接口
 */
interface ContractRequest {
  contractId: string;
  version: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  metadata: Metadata;
  reviewers?: Reviewer[];
  tags?: string[];
  attachments?: Attachment[];
  settings?: Settings;
}

/**
 * 接口响应数据接口
 */
interface ApiResponse<T = any> {
  code: number;
  data: T;
}

export default class LibApi {
  /**
   * 用户登陆
   * @description 这个接口用于用户登陆
   * @param data 登录请求数据
   * @returns Promise<ApiResponse> 登录响应结果
   */
  static login(data: LoginRequest) {
    return request<ApiResponse>({
      url: "/user/login.do",
      method: "POST",
      data,
    });
  }

  /**
   * 提交契约信息
   * @param data 契约信息数据
   * @returns Promise<ApiResponse> 响应结果
   */
  static submitContract(data: ContractRequest) {
    return request<ApiResponse>({
      url: "/lib",
      method: "POST",
      data,
    });
  }
}
