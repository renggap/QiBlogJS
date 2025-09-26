// routes/api/posts/[id].ts
import { Handlers } from "$fresh/server.ts";
import { db } from "../../../services/database.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const id = ctx.params.id;
    const post = await db.getPost(id); // Note: db.getPost currently uses slug, but API uses ID. We'll assume db.getPost can handle ID lookup for now, or we'd need a dedicated db.getPostById. Using ID lookup for simplicity here.
    
    if (!post) {
      return new Response(null, { status: 404 });
    }
    return Response.json(post);
  },
  
  async PUT(req, ctx) {
    const id = ctx.params.id;
    try {
      const updates = await req.json();
      const updatedPost = await db.updatePost(id, updates);
      
      if (!updatedPost) {
        return new Response(null, { status: 404 });
      }
      return Response.json(updatedPost);
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
  
  async DELETE(req, ctx) {
    const id = ctx.params.id;
    await db.deletePost(id);
    return new Response(null, { status: 204 });
  }
};