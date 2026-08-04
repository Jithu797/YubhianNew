import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, List, ListOrdered,
  Quote, Code, LinkIcon, ImageIcon, Minus, Undo, Redo, Heading1, Heading2, Heading3,
} from "lucide-react";

function ToolbarButton({ onClick, active, children, label }: {
  onClick: () => void; active?: boolean; children: React.ReactNode; label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
      style={{
        background: active ? "rgba(37,99,235,0.2)" : "transparent",
        color: active ? "var(--blue2)" : "var(--gray)",
      }}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ content, onChange }: { content: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none min-h-[400px] text-sm leading-relaxed",
      },
    },
  });

  if (!editor) return null;

  function addLink() {
    const url = window.prompt("Enter URL");
    if (url) editor?.chain().focus().setLink({ href: url }).run();
  }

  function addImage() {
    const url = window.prompt("Enter image URL");
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "var(--navy2)", border: "1px solid var(--border)" }}>
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-2" style={{ borderBottom: "1px solid var(--border)" }}>
        <ToolbarButton label="Heading 1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><Heading1 size={15} /></ToolbarButton>
        <ToolbarButton label="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={15} /></ToolbarButton>
        <ToolbarButton label="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={15} /></ToolbarButton>
        <span className="w-px h-5 mx-1" style={{ background: "var(--border)" }} />
        <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={15} /></ToolbarButton>
        <ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={15} /></ToolbarButton>
        <ToolbarButton label="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleMark("underline").run()}><UnderlineIcon size={15} /></ToolbarButton>
        <ToolbarButton label="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough size={15} /></ToolbarButton>
        <span className="w-px h-5 mx-1" style={{ background: "var(--border)" }} />
        <ToolbarButton label="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={15} /></ToolbarButton>
        <ToolbarButton label="Ordered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={15} /></ToolbarButton>
        <ToolbarButton label="Blockquote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={15} /></ToolbarButton>
        <ToolbarButton label="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code size={15} /></ToolbarButton>
        <span className="w-px h-5 mx-1" style={{ background: "var(--border)" }} />
        <ToolbarButton label="Link" active={editor.isActive("link")} onClick={addLink}><LinkIcon size={15} /></ToolbarButton>
        <ToolbarButton label="Image" onClick={addImage}><ImageIcon size={15} /></ToolbarButton>
        <ToolbarButton label="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus size={15} /></ToolbarButton>
        <span className="w-px h-5 mx-1" style={{ background: "var(--border)" }} />
        <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()}><Undo size={15} /></ToolbarButton>
        <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()}><Redo size={15} /></ToolbarButton>
      </div>
      <div className="px-5 py-5">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
