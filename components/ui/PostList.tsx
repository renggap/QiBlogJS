// components/ui/PostList.tsx
import { Post } from "../../models/schema.ts";

interface PostWithCategorySlug extends Post {
  categorySlug: string;
}

interface PostListProps {
  posts: PostWithCategorySlug[];
}

// Define gradient color variations for different post categories
const categoryGradients = {
  purple: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  blue: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  green: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  orange: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  red: "linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)",
  dark: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
  pink: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  cyan: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  violet: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  indigo: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
};

// Function to get a gradient based on category slug
const getGradientForCategory = (categorySlug: string): string => {
  const gradientKeys = Object.keys(categoryGradients);
  const index = categorySlug.length % gradientKeys.length;
  return categoryGradients[gradientKeys[index] as keyof typeof categoryGradients] || categoryGradients.blue;
};

// Function to get a category name from slug
const getCategoryName = (categorySlug: string): string => {
  return categorySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Function to generate tags from post content (in a real app, these might come from the post data)
const generateTags = (post: PostWithCategorySlug): string[] => {
  const baseTags = [getCategoryName(post.categorySlug)];
  
  // Add additional tags based on title keywords
  const titleWords = post.title.toLowerCase().split(' ');
  if (titleWords.includes('react')) baseTags.push('React');
  if (titleWords.includes('typescript')) baseTags.push('TypeScript');
  if (titleWords.includes('javascript')) baseTags.push('JavaScript');
  if (titleWords.includes('css')) baseTags.push('CSS');
  if (titleWords.includes('html')) baseTags.push('HTML');
  if (titleWords.includes('node')) baseTags.push('Node.js');
  if (titleWords.includes('api')) baseTags.push('API');
  if (titleWords.includes('database')) baseTags.push('Database');
  if (titleWords.includes('security')) baseTags.push('Security');
  if (titleWords.includes('testing')) baseTags.push('Testing');
  
  return baseTags.slice(0, 2); // Limit to 2 tags
};

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return <p class="text-center text-gray-500">No posts found.</p>;
  }

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {posts.map(post => {
        const gradient = getGradientForCategory(post.categorySlug);
        const categoryName = getCategoryName(post.categorySlug);
        const tags = generateTags(post);
        const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });

        return (
          <article
            key={post.id}
            class="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
          >
            <a
              href={`/${post.categorySlug}/${post.slug}`}
              class="block no-underline text-inherit"
            >
              <div
                class="h-32 flex items-center justify-center relative text-white font-bold text-sm"
                style={{ background: gradient }}
              >
                <span>{categoryName}</span>
                <div
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm"
                >
                  ✓
                </div>
              </div>
              
              <div class="p-6">
                <h3 class="text-xl font-semibold mb-3 text-gray-800">
                  {post.title}
                </h3>
                
                <p class="text-gray-600 leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                
                <div class="flex justify-between items-center text-sm text-gray-500">
                  <span class="flex items-center gap-1">
                    📅 {formattedDate}
                  </span>
                  
                  <div class="flex gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        class="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </a>
          </article>
        );
      })}
    </div>
  );
}