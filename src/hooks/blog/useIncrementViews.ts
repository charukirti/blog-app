import { blogService } from "@/services/blogService";
import { useEffect } from "react";

export function useIncrementViews(blogId: string | undefined) {
  useEffect(() => {
    if (!blogId) return;
    const key = `viewed_${blogId}`;
    const lastViewed = localStorage.getItem(key);
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    if (!lastViewed || now - parseInt(lastViewed, 10) > oneHour) {
      blogService.incrementBlogView(blogId).catch(console.error);
      localStorage.setItem(key, now.toString());
    }
  }, [blogId]);
}
