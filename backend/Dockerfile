# node.jsのインポート
FROM node:18-alpine

# 作業スペースの確保
WORKDIR /app

# appの中にpackage.jsonをコピー
COPY package*.json ./

# いつもの
RUN npm install

# appにインストールした他のプログラムファイルもコピー
COPY . .

# TSをdockerの中でコンパイルする
RUN npm run build

# ポートの指定
EXPOSE 8080
ENV PORT=8080

# app起動時最初に行うこと
CMD ["npm","start"]