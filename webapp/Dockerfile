FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_ENV=production
EXPOSE 3001

CMD ["npx", "ts-node", "--project", "./tsconfig.json", "./src/server.ts"]
