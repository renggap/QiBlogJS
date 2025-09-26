// routes/api/categories/index.ts
import { Handlers } from "$fresh/server.ts";
import { db } from "../../../services/database.ts";
import { CategorySchema } from "../../../utils/validation.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const categories = await db.getCategories();
    return Response.json(categories);
  },
  
  async POST(req, ctx) {
    try {
      const categoryData = await req.json();
      const validatedData = CategorySchema.parse(categoryData);
      const category = await db.createCategory(validatedData);
      return Response.json(category, { status: 201 });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
};