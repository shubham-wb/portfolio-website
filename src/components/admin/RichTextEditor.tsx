"use client";

import { useRef } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { uploadFile } from "@/lib/upload";
import {
  BoldIcon,
  ItalicIcon,
  CodeIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  ImageIcon,
} from "@/components/icons";

export function RichTextEditor({
  value,
  onChange,
  uploadFolder,
  onError,
  placeholder = "Start writing…",
  compact = false,
}: {
  value?: string;
  onChange: (html: string) => void;
  uploadFolder: string;
  onError?: (msg: string | null) => void;
  placeholder?: string;
  compact?: boolean;
}) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false, // required for Next.js SSR
    extensions: [
      StarterKit,
      LinkExtension.configure({ openOnClick: false, autolink: true }),
      ImageExtension,
      Placeholder.configure({ placeholder }),
    ],
    content: value ?? "",
    editorProps: {
      attributes: {
        class: `prose max-w-none px-4 py-3 outline-none ${
          compact ? "min-h-40" : "min-h-80"
        }`,
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) {
    return (
      <div className="rounded-lg border border-border px-4 py-3 text-sm text-muted">
        Loading editor…
      </div>
    );
  }

  async function handleImage(file: File) {
    onError?.(null);
    try {
      const url = await uploadFile(`${uploadFolder}/${Date.now()}-${file.name}`, file);
      editor!.chain().focus().setImage({ src: url }).run();
    } catch {
      onError?.("Image upload failed — check Cloudinary settings.");
    }
  }

  function setLink() {
    const previous = editor!.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor!.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-card px-2 py-1.5">
        <Btn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
          <BoldIcon className="h-4 w-4" />
        </Btn>
        <Btn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
          <ItalicIcon className="h-4 w-4" />
        </Btn>
        <Divider />
        <Btn active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2">
          <span className="text-sm font-semibold">H2</span>
        </Btn>
        <Btn active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Heading 3">
          <span className="text-sm font-semibold">H3</span>
        </Btn>
        <Btn active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()} title="Paragraph">
          <span className="text-sm">P</span>
        </Btn>
        <Divider />
        <Btn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list">
          <ListIcon className="h-4 w-4" />
        </Btn>
        <Btn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list">
          <ListOrderedIcon className="h-4 w-4" />
        </Btn>
        <Btn active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Quote">
          <QuoteIcon className="h-4 w-4" />
        </Btn>
        <Btn active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Code block">
          <CodeIcon className="h-4 w-4" />
        </Btn>
        <Divider />
        <Btn active={editor.isActive("link")} onClick={setLink} title="Link">
          <LinkIcon className="h-4 w-4" />
        </Btn>
        <Btn active={false} onClick={() => imageInputRef.current?.click()} title="Image">
          <ImageIcon className="h-4 w-4" />
        </Btn>
      </div>

      <EditorContent editor={editor} />

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleImage(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function Btn({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`grid h-8 min-w-8 place-items-center rounded px-1.5 transition-colors hover:bg-card-hover ${
        active ? "bg-accent/15 text-accent" : "text-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-border" aria-hidden />;
}

// Re-exported for callers that want the type.
export type { Editor };
