FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN NODE_OPTIONS="--max-old-space-size=4096" npx nx build webapp --with-deps
ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "--max-old-space-size=3072", "./dist/packages/webapp/server.cjs"]
