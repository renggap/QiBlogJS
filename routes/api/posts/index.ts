// routes/api/posts/index.ts
import { Handlers } from "$fresh/server.ts";
import { db } from "../../../services/database.ts";
import { PostSchema } from "../../../utils/validation.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    // Simplified GET: returns all posts
    const posts = await db.getAllPosts();
    return Response.json(posts);
  },
  
  async POST(req, ctx) {
    try {
      const postData = await req.json();
      const validatedData = PostSchema.parse(postData);
      const post = await db.createPost(validatedData);
      return Response.json(post, { status: 201 });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
};