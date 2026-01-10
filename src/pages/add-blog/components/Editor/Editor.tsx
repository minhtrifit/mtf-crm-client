import ReactDOM from 'react-dom/client';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { Button } from 'antd';
import { UndoOutlined, RedoOutlined } from '@ant-design/icons';

interface PropType {
  onSubmit: (content: string) => void;
}

const Editor = ({ onSubmit }: PropType) => {
  const navigate = useNavigate();

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
              ['image', 'code-block'],
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

  const handleSubmit = () => {
    if (quillInstance.current) {
      const htmlContent = quillInstance.current.root.innerHTML;
      onSubmit(htmlContent);
    }
  };

  return (
    <div className='flex flex-col'>
      <div ref={editorRef} style={{ height: '500px' }} />

      <div className='mt-5 flex items-center justify-end gap-2'>
        <Button
          type='default'
          onClick={() => {
            navigate('/management/blogs');
          }}
        >
          Hủy
        </Button>

        <Button type='primary' onClick={handleSubmit}>
          Lưu
        </Button>
      </div>
    </div>
  );
};

export default Editor;
