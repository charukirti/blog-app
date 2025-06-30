import DashboardBlogCard from "@/components/dashboard/DashboardBlogCard";
import SearchBar from "@/components/ui/SearchBar";
import { useGetUserPosts } from "@/hooks/dashboard/useDashboard";
import { useAppSelector } from "@/store/typedHooks";
import type { Blog } from "@/types";

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: userPosts, isLoading, isError } = useGetUserPosts(user?.$id);
  

  if (isLoading)
    return <p className="text-xl font-semibold">Loading your posts....</p>;

  const posts = (userPosts?.documents as Blog[]) || [];
  return (
    <main>
     <div className="mb-5">
       <SearchBar/>
     </div>
      <section aria-label="blog-list">
        {posts.length > 0 ? (
          posts.map((blog) => <DashboardBlogCard key={blog.$id} blog={blog} />)
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
