FROM node:20-alpine

WORKDIR /app


COPY package*.json ./
RUN npm install


COPY . .


RUN npx prisma generate


EXPOSE 3000


CMD ["sh", "-c", "npx prisma migrate dev --name init --skip-seed && npm run start:dev"]
