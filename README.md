# QiBlogJS

A simple, modern, responsive blogging platform built with **Fresh framework** and **Deno**, featuring a beautiful card-based UI design and comprehensive admin panel.

<img width="1364" height="577" alt="image" src="https://github.com/user-attachments/assets/472a17ce-b6fa-4f4b-b7f7-eaf0834480b2" />

Powered by: 

<img height="67" alt="image" src="https://github.com/user-attachments/assets/43ec806b-2b78-4a0f-aea8-ed66767eb148" /> <img width="167" height="67" alt="image" src="https://github.com/user-attachments/assets/907d6b56-fced-4383-ab3d-ad595d948dee" />


## Features

### Frontend
- **Modern UI Design**: Clean, card-based layout with gradient backgrounds and smooth animations
- **Responsive Design**: Fully responsive layout that works on all devices
- **Interactive Elements**: Hover effects, floating animations, and smooth transitions
- **SEO Optimized**: Built-in SEO optimization with meta tags and structured data
- **Fast Performance**: Built with Fresh for optimal performance and SEO

### Admin Panel
- **Password-Protected Admin**: Secure admin login system
- **WYSIWYG Editor**: Rich text editor for creating and editing posts
- **Post Management**: Create, edit, and manage blog posts
- **Category Management**: Organize content with categories
- **SEO Tools**: Built-in SEO title and meta description fields
- **Automatic Slug Generation**: Auto-generate URL slugs from post titles
- **Form Validation**: Client-side validation without page refresh

### Technical Features
- **TypeScript**: Full TypeScript support for type safety
- **Database Integration**: SQLite database with Deno KV
- **REST API**: RESTful API for posts and categories
- **Sitemap Generation**: Automatic sitemap generation for SEO
- **Image Upload**: Support for featured images
- **Pagination**: Paginated post listings

## Tech Stack

- **Framework**: [Fresh](https://fresh.deno.dev/) - The modern web framework for Deno
- **Runtime**: [Deno](https://deno.land/) - A secure runtime for JavaScript and TypeScript
- **Database**: SQLite with Deno KV
- **Styling**: Tailwind CSS with custom CSS for animations
- **UI Components**: Custom JSX components
- **Rich Text Editor**: Custom WYSIWYG editor implementation

## Getting Started

### Prerequisites

- [Deno](https://deno.land/) installed on your system
- Basic knowledge of TypeScript and React/JSX

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/qiblogjs.git
cd qiblogjs
```

2. Install dependencies:
```bash
deno install
```

3. Start the development server:
```bash
deno task start
```

4. Open your browser and navigate to `http://localhost:8000`

## Project Structure

```
QiBlogJS/
├── components/           # React components
│   ├── admin/           # Admin panel components
│   ├── seo/             # SEO components
│   └── ui/              # UI components
├── islands/             # Fresh islands for interactivity
├── models/              # Database models
├── routes/              # Application routes
│   ├── admin/           # Admin routes
│   ├── api/             # API routes
│   └── [categorySlug]/  # Dynamic category routes
├── services/            # Business logic services
├── static/              # Static assets
├── utils/               # Utility functions
├── config/              # Configuration files
├── tests/               # Test files
├── deno.json            # Deno configuration
├── fresh.config.ts      # Fresh configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── main.ts              # Application entry point
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=./qiblog.db

# Admin
ADMIN_PASSWORD=your_secure_password

# SEO
BASE_URL=http://localhost:8000
```

### Database Setup

The application uses SQLite with Deno KV. The database will be automatically created when you first run the application.

## Usage

### Creating Posts

1. Navigate to `/admin` and log in with your admin password
2. Click "Create New Post"
3. Fill in the post details:
   - Title (required)
   - Content (required)
   - Category (required)
   - Excerpt (optional)
   - SEO Title (optional)
   - Meta Description (optional)
   - Featured Image URL (optional)
4. Click "Save Draft" or "Publish Post"

### Managing Categories

1. Go to Admin → Categories
2. Create, edit, or delete categories as needed
3. Categories are used to organize posts and appear in the URL structure

### SEO Features

- **Automatic SEO**: If SEO title or meta description is not provided, the system will automatically generate them from the post title and content
- **Sitemap**: Automatically generated at `/sitemap.xml`
- **Structured Data**: Built-in structured data for better search engine visibility

## Customization

### Styling

The project uses Tailwind CSS with custom styles. To customize the design:

1. Modify `tailwind.config.ts` for Tailwind-specific customizations
2. Edit `static/styles.css` for custom CSS and animations
3. Update gradient colors in the CSS variables

### UI Components

All UI components are located in the `components/ui/` directory. You can modify these components to change the appearance and behavior of the application.

### Admin Panel

The admin panel components are in `components/admin/`. You can customize the admin interface by modifying these components.

## API Endpoints

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/[id]` - Get a specific post
- `POST /api/posts` - Create a new post
- `PUT /api/posts/[id]` - Update a post
- `DELETE /api/posts/[id]` - Delete a post

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/[id]` - Get a specific category
- `POST /api/categories` - Create a new category
- `PUT /api/categories/[id]` - Update a category
- `DELETE /api/categories/[id]` - Delete a category

## Deployment

### Deno Deploy

1. Install the Deno Deploy CLI:
```bash
deno install -A -r https://deno.land/x/deploy/deployctl.ts
```

2. Deploy your application:
```bash
deployctl deploy --project=qiblogjs --prod --entrypoint=main.ts
```

### Other Platforms

The application can be deployed to any platform that supports Deno, such as:
- Vercel with Deno runtime
- Netlify with Deno functions
- DigitalOcean App Platform
- AWS Lambda with Deno

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

If you have any questions or issues, please create an issue on the GitHub repository.

## Acknowledgments

- [Fresh Framework](https://fresh.deno.dev/) for providing the excellent web framework
- [Deno](https://deno.land/) for the secure and modern runtime
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- The modern blog layout design inspiration from the reference template
