FROM node:8.15-alpine
RUN mkdir -p /app
WORKDIR /app
COPY package.json ./
# 缓存node_modules. 每次package.json变化了，都需要重新构建镜像
RUN npm install --registry=https://registry.npm.taobao.org
VOLUME [ "/app/cubex","/app/qiyu","/app/site" ]
COPY webpack.config.js ./
ENV NODE_ENV production
ENV DOCKER_MODE true
ENTRYPOINT ["npm", "run", "start" ]
EXPOSE 8099

# 这里只是描述web-common内部docker环境，供docker-compose.yml使用。

# 如果要单独使用dockerfile,以下是一些常用命令

# Build - 构建镜像
# 每次package.json 或者webpack.config.js变化了都需要执行以下命令，来重新构建镜像
# docker build --tag=web-common .

# 运行容器的命令，特别长，所以不推荐使用。建议用docker-compose,请查看docker-compose.yml

# windows
# powershell: docker run -p 8099:8099 --rm   -v $PWD/cubex:/app/cubex -v $PWD/qiyu/:/app/qiyu  -v $PWD/site/:/app/site  -v $PWD/webpack.config.js:/app/webpack.config.js web-common
# cmd: docker run -p 8099:8099 --rm   -v %cd%/cubex:/app/cubex -v %cd%/qiyu/:/app/qiyu  -v %cd%/site/:/app/site web-common

# *nix
# docker run -p 8099:8099 --rm   -v `pwd`/cubex:/app/cubex -v `pwd`/qiyu/:/app/qiyu  -v `pwd`/site/:/app/site web-common
