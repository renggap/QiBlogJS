# Dockerfile
FROM denoland/deno:1.40.0

WORKDIR /app

COPY . .

RUN deno cache main.ts

EXPOSE 8000

CMD ["deno", "run", "-A", "main.ts"]