// routes/admin/logout.tsx
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const headers = new Headers();
    headers.set("Location", "/admin/login");
    headers.set(
      "Set-Cookie",
      `admin_auth=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`
    );
    
    return new Response(null, {
      status: 302,
      headers,
    });
  },
};