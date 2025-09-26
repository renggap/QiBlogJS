// config/env.ts

/**
 * Application configuration loaded from environment variables.
 */
export const config = {
  port: Deno.env.get('PORT') || '8000',
  databaseUrl: Deno.env.get('DATABASE_URL'), // Deno KV uses local file path or remote URL
  baseUrl: Deno.env.get('BASE_URL') || 'http://localhost:8000',
  adminPassword: Deno.env.get('ADMIN_PASSWORD'), // For initial setup/auth
  jwtSecret: Deno.env.get('JWT_SECRET') || 'super-secret-default-key', // Should be overridden in production
};