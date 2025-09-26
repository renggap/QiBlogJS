// middleware/auth.ts
import { MiddlewareHandlerContext } from "$fresh/server.ts";

interface AuthState {
  isAuthenticated: boolean;
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<AuthState>
) {
  // Check if the path starts with /admin
  if (req.url.startsWith("/admin")) {
    // Skip auth check for login page
    if (req.url.includes("/admin/login")) {
      return ctx.next();
    }

    // Check if user is authenticated
    const isAuthenticated = checkAuthentication(req);
    
    if (!isAuthenticated) {
      // Redirect to login page
      return new Response("", {
        status: 302,
        headers: {
          Location: "/admin/login",
        },
      });
    }
  }

  return ctx.next();
}

function checkAuthentication(req: Request): boolean {
  // Check for session cookie or token
  const cookies = req.headers.get("cookie") || "";
  const authCookie = cookies
    .split(";")
    .find((cookie) => cookie.trim().startsWith("admin_auth="));
  
  if (authCookie) {
    const token = authCookie.split("=")[1];
    // In a real app, you would validate the token against a database
    // For now, we'll just check if it exists and matches our expected value
    return token === "authenticated";
  }
  
  return false;
}