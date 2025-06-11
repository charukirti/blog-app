import type { Blog } from "@/types";
import BlogCard from "./BlogCard";

interface BlogListProp {
  blogs: Blog[];
}

export default function BlogList({ blogs }: BlogListProp) {
  return (
    <main>
      <h1 className="mb-5 text-4xl font-extrabold uppercase">All blogs</h1>
      <section aria-label="blog-list">
        {blogs.map((blog) => (
          <BlogCard key={blog.$id} blog={blog} />
        ))}
      </section>
    </main>
  );
}
