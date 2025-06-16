import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface TiptapRendererProps {
  content: string;
  className?: string;
}

export function TipTapRenderer({
  content,
  className = "",
}: TiptapRendererProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    editable: false,
    editorProps: {
      attributes: {
        class: `tiptap-content prose prose-invert max-w-none focus:outline-none ${className}`,
      },
    },
  });

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  if (!editor) {
    return null;
  }

  return (
    <div className="tiptap-renderer">
      <EditorContent editor={editor} />
    </div>
  );
}
