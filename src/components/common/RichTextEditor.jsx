// components/common/RichTextEditor.js
import { useState, useEffect } from 'react';

export default function RichTextEditor({ value, onChange }) {
  // 실제 프로젝트에서는 TinyMCE, CKEditor, Quill 등의 
  // 라이브러리를 사용하는 것이 좋습니다.
  // 여기서는 간단한 버전으로 구현합니다.
  
  return (
    <div className="border rounded">
      <div className="border-b bg-gray-50 p-2">
        <div className="flex flex-wrap gap-1">
          {/* 간단한 서식 버튼들 */}
          <button 
            type="button" 
            className="px-2 py-1 border rounded hover:bg-gray-200"
            onClick={() => document.execCommand('bold')}
          >
            B
          </button>
          <button 
            type="button" 
            className="px-2 py-1 border rounded hover:bg-gray-200 italic"
            onClick={() => document.execCommand('italic')}
          >
            I
          </button>
          <button 
            type="button" 
            className="px-2 py-1 border rounded hover:bg-gray-200 underline"
            onClick={() => document.execCommand('underline')}
          >
            U
          </button>
          <select 
            className="px-2 py-1 border rounded"
            onChange={(e) => document.execCommand('formatBlock', false, e.target.value)}
          >
            <option value="p">단락</option>
            <option value="h1">제목 1</option>
            <option value="h2">제목 2</option>
            <option value="h3">제목 3</option>
          </select>
        </div>
      </div>
      
      <div
        className="p-2 min-h-[200px]"
        contentEditable
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
      />
    </div>
  );
}