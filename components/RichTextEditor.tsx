import React, { useEffect, useRef } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<any>(null);

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      // Access global Quill object
      const Quill = (window as any).Quill;
      if (Quill) {
        quillInstance.current = new Quill(editorRef.current, {
          theme: 'snow',
          placeholder: 'Write your story here...',
          modules: {
            toolbar: [
              [{ header: [1, 2, false] }],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'clean'],
            ],
          },
        });

        quillInstance.current.on('text-change', () => {
          const html = editorRef.current?.querySelector('.ql-editor')?.innerHTML;
          if (html) {
            onChange(html);
          }
        });
      }
    }
  }, [onChange]);

  // Handle external value changes (resetting form)
  useEffect(() => {
    if (quillInstance.current && value === '' && editorRef.current) {
        // If the value passed in is empty, clear the editor
        // checking against innerHTML prevents loop if we were to support 2-way properly, 
        // but for reset specifically this is needed.
        quillInstance.current.root.innerHTML = '';
    }
  }, [value]);

  return (
    <div className="bg-white">
      <div ref={editorRef} style={{ height: '300px' }} />
    </div>
  );
};

export default RichTextEditor;
