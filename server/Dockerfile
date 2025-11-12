# 使用官方 Node.js 18 镜像作为基础镜像
FROM node:18-alpine

# 在容器中创建并设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目中的所有文件到工作目录
COPY . .

# 暴露端口 5001
EXPOSE 5001

# 启动应用的命令
CMD ["node", "src/server.js"]