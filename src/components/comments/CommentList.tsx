import { useGetNestedComments } from "@/hooks/comments/useComments";
import CommentItem from "./CommentItem";
interface CommentListProps {
  blogId: string | undefined;
}
export default function CommentList({ blogId }: CommentListProps) {
  const { data, isLoading, isError } = useGetNestedComments(blogId!);

  if (isLoading) return <p>Loading comments...</p>;
  if (isError) return <p className="text-red-500">Error loading comments.</p>;
  return (
    <div className="space-y-6">
      {data?.documents.map((comment) => (
        <CommentItem comment={comment} key={comment?.$id} />
      ))}
    </div>
  );
}
