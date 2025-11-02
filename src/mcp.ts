#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// 基础服务信息
const server = new McpServer({
  name: "happy-arena-mcp",
  version: "0.1.0",
});

// 提取baseUrl
const BASE_URL = "http://127.0.0.1:4523";
const token = "thisIsAToken";

// 工具函数：发送HTTP请求并处理响应
async function sendHttpRequest(
  endpoint: string,
  options: { method: string; headers?: Record<string, string> }
) {
  console.log("endpoint :>> ", endpoint);
  console.log("options :>> ", options);
  const res = await fetch(endpoint, {
    method: options.method,
    headers: options.headers,
  });

  const status = res.status;
  const resHeaders = Object.fromEntries(res.headers.entries());
  const ct = res.headers.get("content-type") || "";

  const [responseText, responseData] = ct.includes("application/json")
    ? ((d) => [JSON.stringify(d, null, 2), d])(await res.json())
    : ((t) => [t, { raw: t }])(await res.text());

  const result = {
    request: {
      url: endpoint,
      method: options.method,
      headers: options.headers,
    },
    response: { status, headers: resHeaders, data: responseData },
  };

  return {
    content: [
      {
        type: "text" as const,
        text: `${options.method} ${endpoint}\nStatus: ${status}\n\n${responseText}`,
      },
    ],
    structuredContent: result,
  };
}

// tool：根据 URL 解析 id 并模拟获取版本详情
server.registerTool(
  "getVersionDetailByUrl",
  {
    description:
      "根据用户提供的 URL 解析其中的 id(版本ID) 参数，使用这个id调用查询当前契约详情的接口获取契约信息。",
    inputSchema: {
      url: z
        .string()
        .describe(
          "包含 id 查询参数的完整 URL，例如 http://127.0.0.1:8080/happy-mcp/start/#/detail?id=121242"
        ),
    },
  },
  async (args, _extra) => {
    console.log("args :>> ", args);
    const { url } = args as {
      url: string;
    };
    const idMatch = url.match(/[?&#]id=([^&#]+)/);
    const id = idMatch ? decodeURIComponent(idMatch[1]) : null;
    // ⚠️这里要做一次测试
    if (!id) throw new Error("未在 URL 中找到 id 参数");
    const endpoint = `${BASE_URL}/m1/2751432-384917-default/api/api/version/get?id=${encodeURIComponent(
      id
    )}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      token,
    };
    return await sendHttpRequest(endpoint, { method: "GET", headers });
  }
);

// tool：根据 appId 和接口名称模拟查询 getApi 接口
server.registerTool(
  "getApiByParams",
  {
    description: "根据 appId 和接口名称查询 getApi，返回 api 的详细数据",
    inputSchema: {
      appId: z
        .union([z.string(), z.number()])
        .describe("应用的 ID，例如 94345"),
      apiName: z.string().describe("接口名称，例如 getApi 或其它具体名称"),
    },
  },
  async (args, _extra) => {
    const appId = String((args as { appId: string | number }).appId);
    const apiName = (args as { apiName: string }).apiName.trim();
    if (!apiName) {
      throw new Error("apiName 不能为空");
    }

    // 模拟返回 openapi 风格的 operation 数据
    const data = {
      appId,
      apiName,
      operation: {
        operationId: `${apiName}_${appId}`,
        summary: `应用 ${appId} 的 ${apiName} 接口`,
        method: "POST",
        path: `/api/${appId}/${apiName}`,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  payload: { type: "object" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "接口调用成功",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    code: { type: "integer" },
                    message: { type: "string" },
                    result: { type: "object" },
                  },
                },
              },
            },
          },
        },
      },
    };

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({ data }, null, 2),
        },
      ],
      structuredContent: { data },
    };
  }
);

// tool:根据应用查询分组信息
server.registerTool(
  "getApiGroupByAppId",
  {
    description: "根据应用ID查询契约分组信息",
    inputSchema: {
      appId: z
        .union([z.string(), z.number()])
        .describe("应用的 ID，例如 94345"),
    },
  },
  async (args, _extra) => {
    const appId = String((args as { appId: string | number }).appId);
    // 模拟返回应用分组信息
    const data = {
      appId,
      groupName: "测试分组",
      groupId: "123456",
    };

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({ data }, null, 2),
        },
      ],
      structuredContent: { data },
    };
  }
);

// 使用 stdio 作为传输层
const transport = new StdioServerTransport();
await server.connect(transport);
