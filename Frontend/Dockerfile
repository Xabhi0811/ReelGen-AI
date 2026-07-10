# Build stage
FROM node:20 as build

WORKDIR /app

# 👇 ADD THIS LINE
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_BASEURL

ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_BASEURL=$VITE_BASEURL

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM node:20

WORKDIR /app
RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]