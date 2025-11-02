import request from "../utils/request";

export default class CommonApi {
  /**
   * 获取通用列表
   * @param data 查询参数（分页、筛选等）
   * @returns Promise
   */
  static list(data: Record<string, any>) {
    return request({
      url: "/common/list",
      method: "post",
      data,
    });
  }

  /**
   * 获取详情
   * @param id 资源ID
   * @returns Promise
   */
  static detail(id: string) {
    return request({
      url: `/common/detail/${id}`,
      method: "get",
    });
  }

  /**
   * 新增数据
   * @param data 提交的实体对象
   * @returns Promise
   */
  static create(data: Record<string, any>) {
    return request({
      url: "/common/create",
      method: "post",
      data,
    });
  }

  /**
   * 更新数据
   * @param id 资源ID
   * @param data 更新的实体对象
   * @returns Promise
   */
  static update(id: string, data: Record<string, any>) {
    return request({
      url: `/common/update/${id}`,
      method: "put",
      data,
    });
  }

  /**
   * 删除数据
   * @param id 资源ID
   * @returns Promise
   */
  static delete(id: string) {
    return request({
      url: `/common/delete/${id}`,
      method: "delete",
    });
  }

  /**
   * 根据ID获取版本详情
   * @param id 版本ID
   * @param appId 应用ID（可选）
   * @returns Promise
   */
  static getVersionDetailById(id: string, appId?: string) {
    const url = new URL("/api/api/version/get", "http://127.0.0.1:4523");
    url.searchParams.append("id", id);
    if (appId) {
      url.searchParams.append("appId", appId);
    }

    return request({
      url: url.toString(),
      method: "GET",
    });
  }
}
