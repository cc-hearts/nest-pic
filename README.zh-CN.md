# Nest-Pic 图床系统

Nest-Pic 是一个简单的图床系统，用于在互联网上存储和分享图片。它基于现代的 Web 技术构建，提供了用户友好的界面和简便的操作方式。您可以将 Nest-Pic 部署到您自己的服务器上，或者将其作为一个在线图床服务使用。

## 功能特点

- 简单易用：Nest-Pic 提供了直观的用户界面，使您可以轻松地上传、管理和分享图片。
- 图片管理：Nest-Pic 允许用户管理他们上传的图片，包括查看、删除、重命名和编辑图片信息。
- 图片预览：Nest-Pic 支持图片预览功能，用户可以在浏览器中直接查看上传的图片。

## 安装和配置

以下是安装和配置 Nest-Pic 的简要步骤：

- 克隆或下载 `Nest-Pic` 代码到您的服务器上。
  > `git clone https://github.com/yourusername/nest-pic.git`
- 创建一个 `MySQL` 数据库，并记录下数据库名称、用户名和密码。
- 在 `Nest-Pic` 代码目录中运行 `npm install` 命令，安装依赖包。
- 在 `Nest-Pic` 代码目录中复制 `app.development` 文件为 `app.production.yaml`，并根据您的服务器环境配置 `app.production.yaml` 文件，包括数据库连接信息、应用密钥和其他配置项。
- 运行 `npm run build` 命令，构建 `Nest-Pic` 应用。

## 贡献

如果您对 `Nest-Pic` 图床系统有兴趣，欢迎您贡献代码、提出问题或者反馈意见。您可以通过创建 Issue 或者提交 Pull Request 来参与项目的开发。

## 许可证

Nest-Pic 图床系统使用 MIT 许可证，详情请参阅 <a href="./LICENSE">LICENSE</a> 文件。
