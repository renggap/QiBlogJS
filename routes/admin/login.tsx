// routes/admin/login.tsx
import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/src/runtime/head.ts";

interface LoginData {
  error?: string;
}

export const handler: Handlers<LoginData> = {
  async POST(req, ctx) {
    const form = await req.formData();
    const password = form.get("password") as string;
    
    // Simple password authentication (in production, use proper hashing and database)
    const ADMIN_PASSWORD = "admin123"; // Change this to a secure password
    
    if (password === ADMIN_PASSWORD) {
      // Set authentication cookie
      const headers = new Headers();
      headers.set("Location", "/admin");
      headers.set(
        "Set-Cookie",
        `admin_auth=authenticated; Path=/; HttpOnly; SameSite=Strict; Max-Age=3600` // 1 hour
      );
      
      return new Response(null, {
        status: 302,
        headers,
      });
    } else {
      return ctx.render({ error: "Invalid password" });
    }
  },
  
  async GET(req, ctx) {
    return ctx.render({});
  },
};

export default function LoginPage({ data }: PageProps<LoginData>) {
  return (
    <>
      <Head>
        <title>Admin Login - QiBlogJS</title>
      </Head>
      <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
        <div class="max-w-md w-full space-y-8 p-10">
          <div class="text-center">
            <div class="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-white bg-opacity-20">
              <span class="text-white text-2xl font-bold">Q</span>
            </div>
            <h2 class="mt-6 text-3xl font-extrabold text-white">
              Admin Login
            </h2>
            <p class="mt-2 text-sm text-indigo-200">
              Sign in to access the admin dashboard
            </p>
          </div>
          
          <form class="mt-8 space-y-6" method="POST">
            <div class="rounded-md shadow-sm -space-y-px">
              <div>
                <label for="password" class="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  class="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>
            
            {data?.error && (
              <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span class="block sm:inline">{data.error}</span>
              </div>
            )}
            
            <div>
              <button
                type="submit"
                class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}