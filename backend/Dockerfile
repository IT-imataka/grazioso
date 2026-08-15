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

# 3000番の指定
EXPOSE 3000

# app起動時最初に行うこと
CMD ["npm","start"]