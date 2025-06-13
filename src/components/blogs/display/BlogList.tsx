import type { Blog } from "@/types";
import BlogCard from "./BlogCard";

interface BlogListProp {
  blogs: Blog[];
}

export default function BlogList({ blogs }: BlogListProp) {
  return (
    <main>
      <section aria-label="blog-list">
        {blogs.length > 0 ? (
          blogs.map((blog) => <BlogCard key={blog.$id} blog={blog} />)
        ) : (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500 dark:text-gray-300">
              No blogs found in the selected category.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
