// routes/admin/categories/index.tsx
import { AdminLayout } from "../../../components/admin/AdminLayout.tsx";
import { PageProps } from "$fresh/server.ts";

export default function AdminCategoriesList(props: PageProps) {
  return (
    <AdminLayout>
      <h1 class="text-3xl font-bold mb-6">Categories Management</h1>
      <div class="bg-white p-6 rounded-lg shadow">
        <p>List of categories and CRUD interface here.</p>
      </div>
    </AdminLayout>
  );
}