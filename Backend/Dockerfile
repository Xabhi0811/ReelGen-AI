FROM node:20

WORKDIR /app

COPY . .

RUN npm install --ignore-scripts

RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "run", "server"]