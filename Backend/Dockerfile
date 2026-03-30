FROM node:20

WORKDIR /app

# Copy everything first
COPY . .

# Then install
RUN npm install

# Generate Prisma client
RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "run", "server"]