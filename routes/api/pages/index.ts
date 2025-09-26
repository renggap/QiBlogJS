// routes/api/pages/index.ts
import { Handlers } from "$fresh/server.ts";
import { db } from "../../../services/database.ts";
import { PageSchema } from "../../../utils/validation.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const pages = await db.getAllPages();
    return Response.json(pages);
  },
  
  async POST(req, ctx) {
    try {
      const pageData = await req.json();
      const validatedData = PageSchema.parse(pageData);
      const page = await db.createPage(validatedData);
      return Response.json(page, { status: 201 });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
};