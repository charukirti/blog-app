import BlogList from "@/components/blogs/display/BlogList";
import CategoryDropdown from "@/components/blogs/display/CategoryDropdown";

import Loader from "@/components/Loader";
import { useGetPosts } from "@/hooks/blog/useBlog";
import type { Blog } from "@/types";
import { useState } from "react";

export default function Home() {
  const { isLoading, data, isError } = useGetPosts();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>There was an error while fetching posts</div>;
  }

  const blogs = (data?.documents as Blog[]) || [];

  const filteredBlogs =
    selectedCategory === "All"
      ? blogs
      : blogs.filter(
          (blog) => blog.category === selectedCategory.toLowerCase(),
        );

  return (
    <div className="mx-auto min-h-screen max-w-7xl">
      <header className="mb-3 flex flex-row items-center justify-between py-6">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 uppercase lg:text-4xl dark:text-gray-200">
            {selectedCategory === "All"
              ? "All Blogs"
              : `${selectedCategory} Blogs`}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {filteredBlogs.length}{" "}
            {filteredBlogs.length === 1 ? "post" : "posts"} found
          </p>
        </div>

        <CategoryDropdown
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </header>
      <main>
        <BlogList blogs={filteredBlogs} />
      </main>
    </div>
  );
}
