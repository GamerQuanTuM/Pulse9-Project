"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  AlignLeft, AlignCenter, AlignRight, 
  ListOrdered, List, Link as LinkIcon, 
  Heading1, Heading2, Quote, Code,
  Undo, Redo, X
} from "lucide-react";
import { useState, useCallback, useEffect } from "react";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
}

export default function TiptapEditor({ content, onChange, className }: TiptapEditorProps) {
  const [linkUrl, setLinkUrl] = useState<string>('');
  const [showLinkForm, setShowLinkForm] = useState<boolean>(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Underline,
      TextStyle,
      Color,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  useEffect(() => {
    if (editor && content === '') {
      editor.commands.setContent('');
    }
  }, [content, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // Add https:// if protocol is missing
    const url = /^https?:\/\//i.test(linkUrl) 
      ? linkUrl 
      : `https://${linkUrl}`;

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run();

    setLinkUrl('');
    setShowLinkForm(false);
  }, [editor, linkUrl]);

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("tiptap-editor", className)}>
      <div className="tiptap-toolbar flex flex-wrap gap-1 p-2 bg-muted/20 border-b">
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-muted' : ''}
        >
          <Bold className="h-4 w-4" />  
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-muted' : ''}
        >
          <Italic className="h-4 w-4" />  
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'bg-muted' : ''}
        >
          <UnderlineIcon className="h-4 w-4" />  
        </Button>

        <span className="w-px h-6 bg-border mx-1 self-center" />
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
        >
          <Heading1 className="h-4 w-4" />  
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
        >
          <Heading2 className="h-4 w-4" />  
        </Button>
        
        <span className="w-px h-6 bg-border mx-1 self-center" />
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-muted' : ''}
        >
          <List className="h-4 w-4" />  
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-muted' : ''}
        >
          <ListOrdered className="h-4 w-4" />  
        </Button>
        
        <span className="w-px h-6 bg-border mx-1 self-center" />
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'bg-muted' : ''}
        >
          <AlignLeft className="h-4 w-4" />  
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? 'bg-muted' : ''}
        >
          <AlignCenter className="h-4 w-4" />  
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'bg-muted' : ''}
        >
          <AlignRight className="h-4 w-4" />  
        </Button>
        
        <span className="w-px h-6 bg-border mx-1 self-center" />
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => setShowLinkForm(!showLinkForm)}
          className={editor.isActive('link') ? 'bg-muted' : ''}
        >
          <LinkIcon className="h-4 w-4" />  
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-muted' : ''}
        >
          <Quote className="h-4 w-4" />  
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'bg-muted' : ''}
        >
          <Code className="h-4 w-4" />  
        </Button>
        
        <span className="w-px h-6 bg-border mx-1 self-center" />
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />  
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />  
        </Button>
      </div>

      {showLinkForm && (
        <div className="p-2 border-b flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="flex-1 px-2 py-1 text-sm border rounded"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                setLink();
              }
            }}
          />
          <Button type="button" size="sm" onClick={setLink}>
            Add
          </Button>
          <Button type="button" size="icon" variant="ghost" onClick={() => setShowLinkForm(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <EditorContent editor={editor} className="p-4 prose max-w-none min-h-[150px]" />
    </div>
  );
}