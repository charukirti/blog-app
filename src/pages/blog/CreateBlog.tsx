import CreateBlogForm from "@/components/blogs/form/CreateBlogForm";
import { useAddBlog, useSaveDraft } from "@/hooks/blog/useBlog";

export default function CreateBlog() {
  const {
    mutate: createBlog,
    isPending: isCreating,
    isError: createError,
  } = useAddBlog();
  const {
    mutate: saveToDraft,
    isPending: isSaving,
    isError: draftError,
  } = useSaveDraft();
  return (
    <>
      <CreateBlogForm
        onSubmit={createBlog}
        isCreating={isCreating}
        error={createError}
        onDraftSave={saveToDraft}
        isSaving={isSaving}
        isDraftError={draftError}
      />
    </>
  );
}
