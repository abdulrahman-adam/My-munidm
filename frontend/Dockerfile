# Stage 1: Build... (keep this as is)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
#RUN npm ci --no-audit --prefer-offline
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# Copy the build output
COPY --from=build /app/dist /usr/share/nginx/html

# --- ADD THIS LINE BELOW ---
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]