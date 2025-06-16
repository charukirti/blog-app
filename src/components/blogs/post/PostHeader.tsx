import { calculateReadTime } from "@/utils/calculateReadTime";
import Avatar from "../common/Avatar";
import GoBack from "./GoBack";
import { formatDate } from "@/utils/formatDate";
import LikeButton from "../common/LikeButton";
import { useAppSelector } from "@/store/typedHooks";
import { BookmarkPlus, MessageCircle, Share } from "lucide-react";

interface PostHeaderProps {
  blogId: string;
  title: string;
  publishedDate: string | undefined;
  authorName: string;
  content: string;
}

export default function PostHeader({
  title,
  publishedDate,
  authorName,
  content,
  blogId,
}: PostHeaderProps) {
  const { user } = useAppSelector((state) => state.auth);
  const readTime = calculateReadTime(content);
  const date = formatDate(publishedDate!);
  return (
    <header className="mb-8">
      <GoBack />
      <div className="mt-4">
        <h1 className="mb-2 text-4xl font-bold">{title}</h1>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <Avatar name={authorName} />
        <span>{authorName}</span>
        <span>{readTime} min read</span>
        <span>{date}</span>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-b py-2">
        <div className="flex items-center gap-3">
          <LikeButton
            blogId={blogId}
            userId={user?.$id}
            variant="minimal"
            size="lg"
          />
          <MessageCircle />
        </div>

        <div className="flex items-center gap-4">
          <BookmarkPlus />
          <Share />
        </div>
      </div>
    </header>
  );
}
