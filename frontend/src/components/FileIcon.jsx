import { File, Image as ImageIcon, FileText, Folder as FolderIcon } from 'lucide-react';

export function getFileIcon(type, fileName = '') {
  if (type === 'folder') return <FolderIcon className="text-amber-500 fill-amber-500/10" size={24} />;

  const isPPT = type.includes('presentation') || fileName.toLowerCase().endsWith('.pptx') || fileName.toLowerCase().endsWith('.ppt');
  const isDoc = type.includes('word') || fileName.toLowerCase().endsWith('.docx') || fileName.toLowerCase().endsWith('.doc');
  const isImage = type.includes('image');
  const isPDF = type.includes('pdf');

  if (isImage) return <ImageIcon className="text-blue-500" size={24} />;
  if (isPDF) return <FileText className="text-red-500" size={24} />;
  if (isPPT) return <FileText className="text-orange-500" size={24} />;
  if (isDoc) return <FileText className="text-indigo-500" size={24} />;
  
  return <File className="text-slate-400" size={24} />;
}
