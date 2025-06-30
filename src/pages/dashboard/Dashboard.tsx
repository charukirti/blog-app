import DashboardBlogCard from "@/components/dashboard/DashboardBlogCard";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import ErrorComponent from "@/components/ui/Error";
import SearchBar from "@/components/ui/SearchBar";
import { useGetUserPosts } from "@/hooks/dashboard/useDashboard";
import { useAppSelector } from "@/store/typedHooks";
import type { Blog } from "@/types";
import { Pen } from "lucide-react";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: userPosts, isLoading, isError } = useGetUserPosts(user?.$id);
  const navigate = useNavigate();

  if (isLoading) return <Loader />;

  if (isError)
    return (
      <ErrorComponent
        title="Something went wrong"
        message="unable to load data, Please try again."
      />
    );

  const posts = (userPosts?.documents as Blog[]) || [];
  return (
    <main>
      <div className="mb-5 flex items-center justify-between">
        <SearchBar />
        <Button variant={"outline"} onClick={() => navigate("/blog/new")}>
          <Pen /> Write
        </Button>
      </div>
      <section aria-label="blog-list">
        {posts.length > 0 ? (
          posts.map((blog) => <DashboardBlogCard key={blog.$id} blog={blog} />)
        ) : (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500 dark:text-gray-300">
              You havent wrote any post.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
