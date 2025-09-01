import React, {useCallback, useEffect, useRef} from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const TOOLBAR_OPTIONS = [[{'header': [1, 2, 3, false]}], ['bold', 'italic', 'underline', 'strike'], [{'list': 'ordered'}, {'list': 'bullet'}], [{'color': []}, {'background': []}], ['link'], ['clean']];

const QuillEditor = ({value, onChange}) => {
    const quillInstance = useRef(null);
    const editorRef = useRef(null);

    const initializeQuill = useCallback((editorNode) => {
        if (!editorNode || quillInstance.current) return;

        const quill = new Quill(editorNode, {
            theme: 'snow', modules: {toolbar: TOOLBAR_OPTIONS},
        });

        if (value) {
            quill.clipboard.dangerouslyPasteHTML(value);
        }

        quill.on('text-change', (delta, oldDelta, source) => {
            if (source === 'user') {
                onChange(quill.root.innerHTML);
            }
        });

        quillInstance.current = quill;
    }, [value, onChange]);

    useEffect(() => {
        if (editorRef.current) {
            initializeQuill(editorRef.current);
        }
        return () => {
            quillInstance.current = null;
        };
    }, [initializeQuill]);

    return <div ref={editorRef} style={{minHeight: '200px'}}/>;
};

export default QuillEditor;