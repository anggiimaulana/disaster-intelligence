import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MediaLibraryPicker } from './media-library-picker';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    List, ListOrdered, Quote, Heading1, Heading2, Heading3,
    Link as LinkIcon, Image as ImageIcon, AlignLeft, AlignCenter,
    AlignRight, Undo2, Redo2, Highlighter, Code, Minus,
} from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minHeight?: string;
    className?: string;
    enableMediaLibrary?: boolean;
}

function ToolbarButton({
    onClick,
    isActive = false,
    children,
    title,
}: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700',
                isActive && 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700',
            )}
        >
            {children}
        </button>
    );
}

function ToolbarDivider() {
    return <div className="mx-1 h-6 w-px bg-slate-200" />;
}

function MenuBar({ editor, onImageButtonClick }: { editor: Editor; onImageButtonClick: () => void }) {
    const addLink = () => {
        const url = window.prompt('Masukkan URL:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50/80 px-2 py-1.5">
            <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="Heading 1">
                <Heading1 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading 2">
                <Heading2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Heading 3">
                <Heading3 className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
                <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
                <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline">
                <UnderlineIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
                <Strikethrough className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive('highlight')} title="Highlight">
                <Highlighter className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')} title="Inline Code">
                <Code className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
                <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Ordered List">
                <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Blockquote">
                <Quote className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Garis Horizontal">
                <Minus className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Rata Kiri">
                <AlignLeft className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Rata Tengah">
                <AlignCenter className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Rata Kanan">
                <AlignRight className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton onClick={addLink} isActive={editor.isActive('link')} title="Tambah Link">
                <LinkIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={onImageButtonClick} title="Tambah Gambar">
                <ImageIcon className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
                <Undo2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
                <Redo2 className="h-4 w-4" />
            </ToolbarButton>
        </div>
    );
}

export default function RichTextEditor({
    value,
    onChange,
    placeholder = 'Mulai menulis di sini...',
    minHeight = '300px',
    className,
    enableMediaLibrary = false,
}: RichTextEditorProps) {
    const [showPicker, setShowPicker] = useState(false);
    const [pendingEditor, setPendingEditor] = useState<Editor | null>(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            Underline,
            Highlight,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'text-blue-600 underline cursor-pointer' },
            }),
            Image.configure({
                HTMLAttributes: { class: 'rounded-lg max-w-full mx-auto' },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Placeholder.configure({ placeholder }),
        ],
        content: value,
        onUpdate: ({ editor: ed }) => {
            onChange(ed.getHTML());
        },
        editorProps: {
            attributes: {
                class: `prose prose-sm max-w-none focus:outline-none px-4 py-3 text-slate-800`,
                style: `min-height: ${minHeight}`,
            },
        },
    });

    useEffect(() => {
        if (editor && editor.getHTML() !== value) {
            editor.commands.setContent(value, { emitUpdate: false });
        }
    }, [editor, value]);

    const handleImageButtonClick = () => {
        if (!editor) return;
        if (enableMediaLibrary) {
            setPendingEditor(editor);
            setShowPicker(true);
        } else {
            const url = window.prompt('Masukkan URL gambar:');
            if (url) {
                editor.chain().focus().setImage({ src: url }).run();
            }
        }
    };

    const handleMediaSelect = (media: { file_path: string; file_url: string }) => {
        if (pendingEditor) {
            pendingEditor.chain().focus().setImage({ src: media.file_url }).run();
        }
        setShowPicker(false);
        setPendingEditor(null);
    };

    if (!editor) {
        return (
            <div className="rounded-lg border border-slate-200 bg-white">
                <div className="h-10 animate-pulse bg-slate-50 rounded-t-lg" />
                <div className="p-4" style={{ minHeight }}>
                    <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100 mb-3" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
                </div>
            </div>
        );
    }

    const text = editor.getText();
    const charCount = text.length;
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

    return (
        <>
            <div className={cn('overflow-hidden rounded-lg border border-slate-200 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500', className)}>
                <MenuBar editor={editor} onImageButtonClick={handleImageButtonClick} />
                <EditorContent editor={editor} />
                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-500">
                    <span>{charCount} karakter</span>
                    <span>{wordCount} kata</span>
                </div>
            </div>

            {enableMediaLibrary && (
                <MediaLibraryPicker
                    open={showPicker}
                    onClose={() => { setShowPicker(false); setPendingEditor(null); }}
                    onSelect={handleMediaSelect}
                    accept="image/*"
                />
            )}
        </>
    );
}
