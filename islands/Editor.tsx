// islands/Editor.tsx
import { useEffect, useRef, useState } from 'preact/hooks';
import { IS_BROWSER } from "$fresh/runtime.ts";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

/**
 * Simple WYSIWYG Editor with formatting toolbar.
 * This component runs only on the client side.
 */
export default function Editor({ content, onChange }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isList, setIsList] = useState(false);
  
  useEffect(() => {
    if (IS_BROWSER && editorRef.current) {
      // Initialize editor content
      editorRef.current.innerHTML = content;
      
      // Handle content changes
      const handleInput = () => {
        if (editorRef.current) {
          onChange(editorRef.current.innerHTML);
          updateToolbarState();
        }
      };
      
      // Handle selection changes to update toolbar state
      const handleSelectionChange = () => {
        updateToolbarState();
      };
      
      editorRef.current.addEventListener('input', handleInput);
      document.addEventListener('selectionchange', handleSelectionChange);
      
      return () => {
        editorRef.current?.removeEventListener('input', handleInput);
        document.removeEventListener('selectionchange', handleSelectionChange);
      };
    }
  }, []);
  
  const updateToolbarState = () => {
    if (!IS_BROWSER) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const parentElement = range.commonAncestorContainer.parentElement;
    
    setIsBold(document.queryCommandState('bold'));
    setIsItalic(document.queryCommandState('italic'));
    setIsUnderline(document.queryCommandState('underline'));
    setIsList(document.queryCommandState('insertUnorderedList'));
  };
  
  const formatText = (command: string, value: string = '') => {
    if (!IS_BROWSER) return;
    
    // Save current selection
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    // For formatting commands
    if (command === 'bold' || command === 'italic' || command === 'underline') {
      document.execCommand(command, false, value);
    }
    // For block formatting
    else if (command === 'formatBlock') {
      document.execCommand('formatBlock', false, value);
    }
    // For lists
    else if (command === 'insertUnorderedList' || command === 'insertOrderedList') {
      document.execCommand(command, false, value);
    }
    // For links
    else if (command === 'createLink') {
      document.execCommand(command, false, value);
    }
    // For removing formatting
    else if (command === 'removeFormat') {
      document.execCommand(command, false, value);
    }
    
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      updateToolbarState();
    }
    editorRef.current?.focus();
  };
  
  const insertLink = () => {
    if (!IS_BROWSER) return;
    
    const url = prompt('Enter URL:');
    if (url) {
      formatText('createLink', url);
    }
  };
  
  return (
    <div class="w-full border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div class="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => formatText('bold')}
          class={`p-2 rounded hover:bg-gray-200 transition-colors ${isBold ? 'bg-gray-200' : ''}`}
          title="Bold"
        >
          <span class="font-bold">B</span>
        </button>
        <button
          type="button"
          onClick={() => formatText('italic')}
          class={`p-2 rounded hover:bg-gray-200 transition-colors ${isItalic ? 'bg-gray-200' : ''}`}
          title="Italic"
        >
          <span class="italic">I</span>
        </button>
        <button
          type="button"
          onClick={() => formatText('underline')}
          class={`p-2 rounded hover:bg-gray-200 transition-colors ${isUnderline ? 'bg-gray-200' : ''}`}
          title="Underline"
        >
          <span class="underline">U</span>
        </button>
        <div class="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          type="button"
          onClick={() => formatText('formatBlock', '<h2>')}
          class="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => formatText('formatBlock', '<h3>')}
          class="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Heading 3"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => formatText('formatBlock', '<p>')}
          class="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Paragraph"
        >
          P
        </button>
        <div class="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          type="button"
          onClick={() => formatText('insertUnorderedList')}
          class={`p-2 rounded hover:bg-gray-200 transition-colors ${isList ? 'bg-gray-200' : ''}`}
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => formatText('insertOrderedList')}
          class="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Numbered List"
        >
          1. List
        </button>
        <div class="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          type="button"
          onClick={insertLink}
          class="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Insert Link"
        >
          🔗
        </button>
        <button
          type="button"
          onClick={() => formatText('removeFormat')}
          class="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Clear Formatting"
        >
          ✕
        </button>
      </div>
      
      {/* Editor Content */}
      <div
        ref={editorRef}
        contentEditable
        class="min-h-[300px] p-4 focus:outline-none prose prose-sm max-w-none"
        style={{
          minHeight: '300px',
          lineHeight: '1.6',
        }}
        onPaste={(e) => {
          // Handle paste to strip formatting
          e.preventDefault();
          const text = e.clipboardData?.getData('text/plain') || '';
          document.execCommand('insertText', false, text);
        }}
      />
      
      {/* Hidden input to store content for form submission */}
      <input type="hidden" name="content" value={content} />
      
      {/* Character count */}
      <div class="bg-gray-50 border-t border-gray-300 px-4 py-2 text-xs text-gray-500">
        {content.replace(/<[^>]*>/g, '').length} characters
      </div>
    </div>
  );
}