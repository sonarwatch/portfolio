FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "-r", "ts-node/register", "--max-old-space-size=3000", "./src/server.ts"]
