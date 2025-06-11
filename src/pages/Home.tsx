import BlogList from "@/components/blogs/display/BlogList";
import Loader from "@/components/Loader";
import { useGetPosts } from "@/hooks/blog/useBlog";
import type { Blog } from "@/types";

export default function Home() {
  const { isLoading, data, isError } = useGetPosts();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>There was an error while fetching posts</div>;
  }

  const blogs = (data?.documents as Blog[]) || [];
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-5 lg:flex-row-reverse">
      <aside className="border-b border-gray-200 bg-white p-6 text-black lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-l">
        sidebar
      </aside>
      <main className="flex-1">
        <BlogList blogs={blogs} />
      </main>
    </div>
  );
}
