import { useState, useEffect } from 'react';
import mammoth from 'mammoth';
import DOMPurify from 'dompurify';

const DocxViewer = ({ url }) => {
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then(res => res.arrayBuffer())
      .then(buffer => mammoth.convertToHtml({ arrayBuffer: buffer }))
      .then(result => {
        setHtml(DOMPurify.sanitize(result.value));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setHtml('<div class="text-center text-red-500">Failed to load document preview.</div>');
        setLoading(false);
      });
  }, [url]);

  if (loading) return <div className="flex items-center justify-center h-full text-slate-500">Processing document...</div>;

  return (
    <div className="h-full max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 pr-2">
      <div 
        className="bg-white p-8 min-h-full shadow-sm rounded-lg docx-viewer prose prose-slate max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export default DocxViewer;
