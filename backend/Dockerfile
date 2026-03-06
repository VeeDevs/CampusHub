FROM node:20-alpine

WORKDIR /app
COPY backend/package*.json ./backend/
COPY database/prisma ./database/prisma

WORKDIR /app/backend
RUN npm install

COPY backend ./
RUN npx prisma generate --schema /app/database/prisma/schema.prisma
RUN npm run build

EXPOSE 8080
CMD ["npm", "run", "start"]
