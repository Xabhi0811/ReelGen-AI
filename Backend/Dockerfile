FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

# ✅ Run prisma at runtime (NOT build time)
CMD sh -c "npx prisma generate && npm run server"