# AI Travel Planner

AI Travel Planner 是一款基于 AI 的全栈旅行计划应用。它允许用户注册、登录，并使用 AI 来创建个性化的旅行计划。前端使用 React 构建，后端则由 Node.js/Express 驱动。

> **⚠️ 重要安全警告**
>
> **此项目是一个课程作业，根据老师的要求，DeepSeek API 密钥被直接放置在此 `README.md` 文件中。**
>
> 在任何真实的、非教学目的的项目中，这都是一个**极其危险**的做法。公开 API 密钥会导致您的账户被盗用、产生意想不到的费用，并可能导致服务被暂停。在生产环境中，密钥和所有敏感信息都应通过环境变量等安全方式进行管理，并且绝不应提交到版本控制系统（如 Git）中。

## DeepSeek API Key

以下是本项目根据课程要求公开的 DeepSeek API 密钥：
`sk-881268e2a2c44b9ea66d4080f8d33f0c`

---

## ✨ 功能列表 (Features)

*   **用户认证**: 提供用户注册和登录功能，使用 JSON Web Tokens (JWT) 进行会话管理。
*   **AI 智能规划**: 集成 DeepSeek API，根据用户输入的目的地、天数和兴趣偏好，智能生成旅行日程。
*   **旅行计划管理**: 创建、查看、编辑和删除旅行计划。
*   **响应式设计**: 前端界面适配桌面和移动设备。

---

## 🛠️ 技术栈 (Tech Stack)

*   **前端**: React, Tailwind CSS, Ant Design
*   **后端**: Node.js, Express.js, Mongoose
*   **数据库**: MongoDB
*   **AI 集成**: DeepSeek API
*   **容器化**: Docker, Docker Compose
*   **持续集成/持续部署 (CI/CD)**: GitHub Actions

---

## 🚀 如何运行项目 (How to Run)

本项目使用 Docker Compose 进行容器化管理，可以实现一键构建和启动。这是运行此项目的唯一推荐方式。

### 环境要求
*   [Docker](https://www.docker.com/get-started) 和 [Docker Compose](https://docs.docker.com/compose/install/)
*   一个正在本地运行的 [MongoDB](https://www.mongodb.com/try/download/community) 实例。

### 运行步骤

1.  **克隆仓库:**
    打开您的终端，克隆此 GitHub 仓库到您的本地机器。
    ```bash
    git clone https://github.com/KGW-Yuan/AI-Travel-Planner.git
    cd AI-Travel-Planner
    ```

2.  **配置环境变量:**
    后端服务需要一个 `.env` 文件来连接数据库和配置密钥。请在 `server/` 目录下手动创建 `.env` 文件 (`server/.env`)，并填入以下内容。
    ```env
    MONGO_URI=mongodb://localhost:27017/ai-travel-planner
    JWT_SECRET=your_super_secret_jwt_key
    DEEPSEEK_API_KEY=sk-881268e2a2c44b9ea66d4080f8d33f0c
    ```
    *请注意：您需要确保 `MONGO_URI` 中的地址能够正确连接到您的 MongoDB 实例。*

3.  **构建并启动应用:**
    在项目根目录下（即 `AI-Travel-Planner` 目录），运行以下命令：
    ```bash
    docker-compose up --build
    ```
    此命令会自动完成所有操作：它将分别为前端和后端构建 Docker 镜像，然后启动所有服务。

    服务成功启动后：
    *   **前端应用** 将运行在 `http://localhost:3000`
    *   **后端 API** 将运行在 `http://localhost:5000`

---

## 📡 API 端点 (API Endpoints)

后端服务提供以下主要 API 端点：

*   `POST /api/auth/register`: 用户注册
*   `POST /api/auth/login`: 用户登录
*   `GET /api/plans`: 获取当前用户的所有旅行计划
*   `POST /api/plans`: 创建一个新的旅行计划
*   `POST /api/generate-plan`: 调用 AI 生成旅行建议

---

## 部署 (Deployment)

本项目配置了使用 GitHub Actions 的 CI/CD 工作流。当代码被推送到 `initial-setup` 分支或相关的拉取请求被合并时，该工作流会自动触发，将生产级的 Docker 镜像构建并推送到私有的容器仓库中，为后续的生产环境部署做好准备。

---

此项目在 AI 结对程序员的协助下完成开发。