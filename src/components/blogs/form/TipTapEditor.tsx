import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useController, type Control, type FieldError } from "react-hook-form";

import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Undo,
} from "lucide-react";
import type { CreateBlogFormData } from "@/schemas/blogSchemas";
import { Label } from "@/components/ui/label";

interface TiptapEditorProps {
  control: Control<CreateBlogFormData>;
  name: keyof CreateBlogFormData;
  label: string;
  placeholder?: string;
  error?: FieldError;
  id: string;
}

export default function TipTapEditor({
  id,
  control,
  name,
  label,
  placeholder = "Start writing your blog post",
  error,
}: TiptapEditorProps) {
  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
    defaultValue: "",
  });

  const getEditorContent = (): string => {
    if (typeof value === "string") {
      return value;
    }

    return "";
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
        },
      }),
    ],
    content: getEditorContent(),
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none focus:outline-none min-h-[300px] p-4 dark:prose-invert",
      },
    },
  });

  const setLink = () => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  if (!editor) {
    return <div className="h-96 animate-pulse rounded-lg bg-gray-200"></div>;
  }

  return (
    <section>
      <Label
        htmlFor={id}
        className="text-foreground mb-1 block text-2xl font-semibold tracking-wide"
      >
        {label}
      </Label>

      <div className="overflow-hidden rounded-lg border border-gray-300 bg-white dark:border-gray-500 dark:bg-gray-700">
        <div className="flex flex-wrap gap-1 border-b border-gray-200 bg-gray-50 p-2 dark:border-gray-600 dark:bg-gray-800">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-600 ${
              editor.isActive("bold") ? "bg-gray-300 dark:bg-gray-700" : ""
            }`}
            title="Bold"
          >
            <Bold size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-600 ${
              editor.isActive("italic") ? "bg-gray-300 dark:bg-gray-700" : ""
            }`}
            title="Italic"
          >
            <Italic size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-600 ${
              editor.isActive("strike") ? "bg-gray-300 dark:bg-gray-700" : ""
            }`}
            title="Strikethrough"
          >
            <Strikethrough size={16} />
          </button>

          <div className="mx-1 h-6 w-px self-center bg-gray-300 dark:bg-gray-600"></div>

          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-600 ${
              editor.isActive("heading", { level: 1 })
                ? "bg-gray-300 dark:bg-gray-700"
                : ""
            }`}
            title="Heading 1"
          >
            <Heading1 size={16} />
          </button>

          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-600 ${
              editor.isActive("heading", { level: 2 })
                ? "bg-gray-300 dark:bg-gray-700"
                : ""
            }`}
            title="Heading 2"
          >
            <Heading2 size={16} />
          </button>

          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-600 ${
              editor.isActive("heading", { level: 3 })
                ? "bg-gray-300 dark:bg-gray-700"
                : ""
            }`}
            title="Heading 3"
          >
            <Heading3 size={16} />
          </button>

          <div className="mx-1 h-6 w-px self-center bg-gray-300 dark:bg-gray-600"></div>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-600 ${
              editor.isActive("bulletList")
                ? "bg-gray-300 dark:bg-gray-700"
                : ""
            }`}
            title="Bullet List"
          >
            <List size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-600 ${
              editor.isActive("orderedList")
                ? "bg-gray-300 dark:bg-gray-700"
                : ""
            }`}
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </button>

          <div className="mx-1 h-6 w-px self-center bg-gray-300 dark:bg-gray-600"></div>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-600 ${
              editor.isActive("blockquote")
                ? "bg-gray-300 dark:bg-gray-700"
                : ""
            }`}
            title="Quote"
          >
            <Quote size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-600 ${
              editor.isActive("code") ? "bg-gray-300 dark:bg-gray-700" : ""
            }`}
            title="Inline code"
          >
            <Code size={16} />
          </button>

          <div className="mx-1 h-6 w-px self-center bg-gray-300 dark:bg-gray-600"></div>

          <button
            type="button"
            onClick={setLink}
            className={`rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-600 ${
              editor.isActive("link") ? "bg-gray-300 dark:bg-gray-700" : ""
            }`}
            title="Add Link"
          >
            <LinkIcon size={16} />
          </button>

          <div className="mx-1 h-6 w-px self-center bg-gray-300 dark:bg-gray-600"></div>

          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="rounded p-2 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-600"
            title="Undo"
          >
            <Undo size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="rounded p-2 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-600"
            title="Redo"
          >
            <Redo size={16} />
          </button>
          {/* <button onClick={() => console.log(editor.getHTML())} type="button">
            Debug HTML
          </button> */}
        </div>

        <EditorContent
          editor={editor}
          className="max-h-[500px] min-h-[300px] overflow-y-auto"
        />
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </section>
  );
}
