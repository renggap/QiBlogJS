// utils/validation.ts
import { Post, Category, Page } from "../models/schema.ts";

// Placeholder for Zod schemas (Phase 13 mentions Zod, but we use simple type checking here)

export const PostSchema = {
  parse: (data: any): Omit<Post, 'id' | 'createdAt' | 'updatedAt'> => {
    // Simplified validation: ensure required fields exist
    if (!data.title || !data.slug || !data.content || !data.categoryId || !data.status) {
      throw new Error("Validation Error: Missing required post fields.");
    }
    return data as Omit<Post, 'id' | 'createdAt' | 'updatedAt'>;
  }
};

export const CategorySchema = {
  parse: (data: any): Omit<Category, 'id' | 'createdAt'> => {
    if (!data.name || !data.slug || !data.description) {
      throw new Error("Validation Error: Missing required category fields.");
    }
    return data as Omit<Category, 'id' | 'createdAt'>;
  }
};

export const PageSchema = {
  parse: (data: any): Omit<Page, 'id' | 'createdAt' | 'updatedAt'> => {
    if (!data.title || !data.slug || !data.content || !data.status) {
      throw new Error("Validation Error: Missing required page fields.");
    }
    return data as Omit<Page, 'id' | 'createdAt' | 'updatedAt'>;
  }
};