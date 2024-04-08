# 使用官方的 Node 镜像作为构建阶段
FROM node:18 AS build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制整个项目到工作目录
COPY . .

# 构建 React 项目
RUN npm run build

# 使用 Nginx 作为生产阶段的基础镜像
FROM nginx:alpine

# 将 Nginx 配置文件复制到容器中
COPY nginx.conf /etc/nginx/nginx.conf

# 删除默认的 Nginx 静态文件，并替换为构建好的 React 静态文件
RUN rm -rf /usr/share/nginx/html/*

# 复制 React 构建的静态文件到 Nginx 目录
COPY --from=build /app/dist /usr/share/nginx/html

# 暴露端口 80
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
