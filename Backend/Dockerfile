FROM node:20

WORKDIR /app

COPY . .

# Skip prisma generate during install
RUN npm install --ignore-scripts

# Now manually generate Prisma (without needing DATABASE_URL)
RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "run", "server"]