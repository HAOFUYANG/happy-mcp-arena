# MCP 本地调试方案

本文档提供了基于 MCP Inspector 工具的本地调试方案，帮助开发者高效调试和测试 MCP 服务器相关功能。

## 1. 项目架构分析

当前项目是一个基于 Node.js 和 TypeScript 开发的 MCP 服务器实现，主要组件包括：

- **TypeScript**: 类型安全的 JavaScript 超集
- **@modelcontextprotocol/sdk**: MCP 协议的官方 SDK
- **@modelcontextprotocol/inspector**: MCP 调试工具
- **zod**: 数据验证库

## 2. MCP Inspector 工具介绍

### 2.1 工具功能概述

根据 [MCP Inspector 文档](https://mcp-docs.cn/docs/tools/inspector)，Inspector 提供了以下核心功能：

- **Server 连接面板**: 连接到 MCP 服务器
- **Resources 标签页**: 查看和测试资源
- **Prompts 标签页**: 测试提示模板
- **Tools 标签页**: 测试服务器注册的工具
- **Notifications 面板**: 监控服务器日志和通知

### 2.2 与当前项目的集成

项目已在 `package.json` 中配置了 `dev` 脚本，使用 Inspector 启动服务：

```json
"scripts": {
  "dev": "DANGEROUSLY_OMIT_AUTH=true npx @modelcontextprotocol/inspector node dist/mcp.js"
}
```

## 3. 本地调试环境配置

### 3.1 安装依赖

确保已安装项目依赖：

```bash
npm install
```

### 3.2 构建项目

```bash
npm run build
```

### 3.3 创建调试配置文件

创建 `.mcp-debug.json` 文件，配置调试参数：

```json
{
  "server": {
    "command": "node",
    "args": ["dist/mcp.js"],
    "env": {
      "DANGEROUSLY_OMIT_AUTH": "true",
      "DEBUG": "mcp:*"
    }
  },
  "transport": {
    "type": "stdio"
  }
}
```

## 4. 调试流程设计

### 4.1 启动调试服务

使用已配置的 dev 脚本启动调试环境：

```bash
npm run dev
```

### 4.2 测试服务器工具

项目已注册三个工具，可在 Inspector 的 Tools 标签页中测试：

1. **getVersionDetailByUrl**: 根据 URL 解析 id 并获取版本详情
2. **getApiByParams**: 根据 appId 和接口名称查询接口详情
3. **getApiGroupByAppId**: 根据应用 ID 查询契约分组信息

### 4.3 调试工具调用示例

**测试 getVersionDetailByUrl 工具**:

```bash
# 方式1: 通过 Inspector UI 测试
# 方式2: 通过命令行测试
npx @modelcontextprotocol/inspector node dist/mcp.js --tool getVersionDetailByUrl --arg '{"url":"arena-luna.fat.qa.pab.com.cn/#/contract-design/interlayer/details?groupId=41753&id=6539507&apiId=1479644&appId=94345"}'
```

## 5. 常见问题解决方案

### 5.1 连接问题

**问题**: 无法连接到 MCP 服务器
**解决方案**:
- 确保已运行 `npm run build` 生成 dist 目录
- 检查 `.mcp-debug.json` 配置是否正确
- 查看控制台输出的错误信息

### 5.2 工具调用失败

**问题**: 调用工具时返回错误
**解决方案**:
- 检查工具参数格式是否正确
- 查看 `mcp.ts` 中对应工具的实现逻辑
- 检查外部依赖服务是否正常运行

### 5.3 数据处理错误

**问题**: 返回的数据格式不符合预期
**解决方案**:
- 检查 `generateContentFromStructured` 函数的实现
- 调试 `sendHttpRequest` 函数的返回值
- 添加日志输出以跟踪数据流转

## 6. 调试最佳实践

### 6.1 开发工作流程

1. **开始开发**
   - 运行 `npm run dev` 启动 Inspector
   - 验证基本连接
   - 检查能力协商

2. **迭代测试**
   - 对服务器进行更改
   - 重新构建: `npm run build`
   - 重新连接 Inspector
   - 测试受影响的功能
   - 监控消息

3. **测试边界情况**
   - 无效输入
   - 缺少参数
   - 并发操作
   - 验证错误处理

### 6.2 调试技巧

- 使用 Inspector 的 Notifications 面板监控服务器日志
- 在代码中添加 `console.log` 输出关键变量和流程
- 使用 TypeScript 的类型检查确保接口兼容性
- 利用 zod 进行数据验证，提高代码健壮性

## 7. 扩展调试功能

### 7.1 添加自定义调试命令

在 `package.json` 中添加更灵活的调试命令：

```json
"scripts": {
  "dev": "DANGEROUSLY_OMIT_AUTH=true npx @modelcontextprotocol/inspector node dist/mcp.js",
  "debug:tool": "npx @modelcontextprotocol/inspector node dist/mcp.js --tool",
  "debug:watch": "tsc -w & nodemon --watch dist --exec 'npx @modelcontextprotocol/inspector node dist/mcp.js'"
}
```

### 7.2 集成到 CI/CD 流程

添加自动化测试脚本，使用 Inspector 验证 MCP 服务器功能：

```bash
# test-mcp.sh
npm run build
echo "Testing MCP server tools..."
npx @modelcontextprotocol/inspector node dist/mcp.js --tool getApiGroupByAppId --arg '{"appId":"94345"}'
```

## 8. 总结

本调试方案提供了完整的 MCP 本地调试能力，通过集成 MCP Inspector 工具，开发者可以高效地进行 MCP 服务器的开发、测试和问题排查。遵循本文档中的配置和最佳实践，可以显著提高开发效率和代码质量。