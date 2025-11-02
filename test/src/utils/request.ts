// src/utils/request.ts
interface RequestOptions extends RequestInit {
  url: string;
  data?: Record<string, any>;
}

const request = async <T = any>(options: RequestOptions): Promise<T> => {
  const { url, method = "GET", data, headers = {}, ...rest } = options;

  // 构建请求配置
  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...rest,
  };

  // 处理请求体
  if (data && ["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 尝试解析JSON响应
    const result = await response.json();
    return result as T;
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
};

export default request;
