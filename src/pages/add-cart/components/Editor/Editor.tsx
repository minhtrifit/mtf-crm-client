import ReactDOM from 'react-dom/client';
import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { UndoOutlined, RedoOutlined } from '@ant-design/icons';

interface PropType {
  value: string;
  onChange: (value: string) => void;
  height?: number | string;
}

const Editor = ({ value, onChange, height = 500 }: PropType) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: {
            container: [
              [{ header: [1, 2, false] }],
              ['bold', 'italic', 'underline'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ indent: '-1' }, { indent: '+1' }],
              [{ align: [] }],
              [{ color: [] }, { background: [] }],
              ['image', 'code-block', 'link'],
              ['undo', 'redo'],
            ],
            handlers: {
              undo: () => quillInstance.current?.history.undo(),
              redo: () => quillInstance.current?.history.redo(),
            },
          },
          history: {
            delay: 1000,
            maxStack: 100,
            userOnly: true,
          },
        },
      });

      // Set initial content
      quillInstance.current.root.innerHTML = value || '';

      // Listen change
      quillInstance.current.on('text-change', () => {
        onChange(quillInstance.current!.root.innerHTML);
      });

      // Replace undo/redo icons
      const toolbar = editorRef.current.previousSibling as HTMLElement;
      if (toolbar) {
        const undoBtn = toolbar.querySelector('.ql-undo') as HTMLButtonElement;
        const redoBtn = toolbar.querySelector('.ql-redo') as HTMLButtonElement;

        if (undoBtn) {
          const root = ReactDOM.createRoot(undoBtn);
          root.render(<UndoOutlined />);
        }
        if (redoBtn) {
          const root = ReactDOM.createRoot(redoBtn);
          root.render(<RedoOutlined />);
        }
      }
    }
  }, []);

  // Sync when value changes from outside
  useEffect(() => {
    if (quillInstance.current && value !== quillInstance.current.root.innerHTML) {
      quillInstance.current.root.innerHTML = value || '';
    }
  }, [value]);

  return <div ref={editorRef} style={{ height }} />;
};

export default Editor;
