import request from "../utils/request";

/**
 * 版本信息查询请求参数接口
 */
interface VersionInfoParams {
  versionId: string; // 版本号
  userID: string; // 用户ID
}

/**
 * 版本信息响应数据接口
 */
interface VersionData {
  advanceInfo: {
    appVersion: string;
  };
  info: {
    name: string;
    mockUrl: string;
    httpMethod: string;
  };
  operation: Record<string, any>;
}

/**
 * 接口响应数据接口
 */
interface ApiResponse<T = any> {
  code: number;
  data: T;
}

/**
 * 版本信息相关API
 */
export default class VersionApi {
  /**
   * 版本信息查询
   * @description 台式电脑机械硬盘SATA串口320G 500G 1TB 2T 3TB 4TB支持游戏监控
   * @param params 版本信息查询参数
   * @param headers 请求头信息
   * @returns Promise<ApiResponse<VersionData>> 版本信息响应结果
   */
  static getVersionInfo(
    params: VersionInfoParams,
    headers?: Record<string, string>
  ) {
    // 构建URL，替换path参数
    const url = `/api/versionInfo/${params.versionId}`;
    
    // 构建查询参数
    const queryParams = new URLSearchParams();
    queryParams.append("userID", params.userID);
    
    // 构建完整URL
    const fullUrl = `${url}?${queryParams.toString()}`;
    
    return request<ApiResponse<VersionData>>({
      url: fullUrl,
      method: "GET",
      headers: {
        authorization: headers?.authorization || "",
        ...headers,
      },
    });
  }
}