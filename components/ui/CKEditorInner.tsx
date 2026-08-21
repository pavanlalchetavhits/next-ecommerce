'use client';

import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  List,
  BlockQuote,
  Table,
  TableToolbar,
  TableProperties,
  TableCellProperties,
  TableColumnResize,
  TableCaption,
  MediaEmbed,
  Indent,
  Undo,
  Image,
  ImageBlock,
  ImageInline,
  ImageTextAlternative,
  ImageToolbar,
  ImageCaption,
  ImageStyle,
  ImageResize,
  ImageResizeEditing,
  ImageResizeHandles,
  ImageUpload,
  Alignment,
  ButtonView,
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import api from '@/lib/axios';

interface CKEditorInnerProps {
  value: string;
  onChange: (data: string) => void;
  placeholder?: string;
}

class CustomUploadAdapter {
  loader: any;

  constructor(loader: any) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      (file: File) =>
        new Promise((resolve, reject) => {
          const uploadData = new FormData();
          uploadData.append('file', file);

          api
            .post('/api/upload/image', uploadData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            })
            .then((res) => {
              if (res.data?.success && res.data?.data?.url) {
                resolve({
                  default: res.data.data.url,
                });
              } else {
                reject(res.data?.message || 'Image upload failed');
              }
            })
            .catch((err) => {
              reject(
                err.response?.data?.message ||
                  'Failed to upload image. Please try again.'
              );
            });
        })
    );
  }

  abort() {}
}

function CustomUploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new CustomUploadAdapter(loader);
  };
}

function DeleteImagePlugin(editor: any) {
  editor.ui.componentFactory.add('deleteImage', (locale: any) => {
    const view = new ButtonView(locale);

    view.set({
      label: 'Delete Image',
      icon: `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M6 2a1 1 0 0 0-1 1v1H3a1 1 0 0 0 0 2h1v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2h-2V3a1 1 0 0 0-1-1H6zm2 2h4v1H8V4zm-1 4a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1zm6 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1z"/></svg>`,
      tooltip: true,
    });

    view.on('execute', () => {
      editor.model.change((writer: any) => {
        const selectedElement =
          editor.model.document.selection.getSelectedElement();
        if (selectedElement) {
          writer.remove(selectedElement);
        } else {
          editor.execute('delete');
        }
      });
    });

    return view;
  });
}

const editorConfiguration = {
  plugins: [
    Essentials,
    Paragraph,
    Heading,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Link,
    List,
    BlockQuote,
    Table,
    TableToolbar,
    TableProperties,
    TableCellProperties,
    TableColumnResize,
    TableCaption,
    MediaEmbed,
    Indent,
    Undo,
    Image,
    ImageBlock,
    ImageInline,
    ImageTextAlternative,
    ImageToolbar,
    ImageCaption,
    ImageStyle,
    ImageResize,
    ImageResizeEditing,
    ImageResizeHandles,
    ImageUpload,
    Alignment,
    CustomUploadAdapterPlugin,
    DeleteImagePlugin,
  ],
  toolbar: [
    'heading',
    '|',
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'link',
    'bulletedList',
    'numberedList',
    '|',
    'alignment',
    'uploadImage',
    'blockQuote',
    'insertTable',
    'mediaEmbed',
    '|',
    'outdent',
    'indent',
    '|',
    'undo',
    'redo',
  ],
  image: {
    toolbar: [
      'imageStyle:inline',
      'imageStyle:block',
      'imageStyle:side',
      '|',
      'toggleImageCaption',
      'imageTextAlternative',
      '|',
      'resizeImage',
      '|',
      'deleteImage',
    ],
    resizeUnit: '%',
    resizeOptions: [
      {
        name: 'resizeImage:original',
        label: 'Original size',
        value: null,
      },
      {
        name: 'resizeImage:25',
        label: '25%',
        value: '25',
      },
      {
        name: 'resizeImage:50',
        label: '50%',
        value: '50',
      },
      {
        name: 'resizeImage:75',
        label: '75%',
        value: '75',
      },
    ],
  },
  table: {
    contentToolbar: [
      'tableColumn',
      'tableRow',
      'mergeTableCells',
      'tableProperties',
      'tableCellProperties',
      'toggleTableCaption',
    ],
  },
  heading: {
    options: [
      { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
      { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
      { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
      { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
    ],
  },
  placeholder: 'Type or paste content here...',
};

export default function CKEditorInner({
  value,
  onChange,
  placeholder,
}: CKEditorInnerProps) {
  return (
    <div className="ckeditor-custom-wrapper rounded-xl border border-[#E9EDF7] overflow-hidden bg-white shadow-sm transition-all focus-within:border-[#6366F1] focus-within:ring-2 focus-within:ring-indigo-500/10">
      <style>{`
        .ck-editor__editable_inline {
          min-height: 180px;
          padding: 0.75rem 1rem !important;
          font-size: 0.875rem;
          color: #0f172a;
        }
        .ck-editor__editable_inline h1 {
          font-size: 1.875rem !important;
          font-weight: 800 !important;
          line-height: 2.25rem !important;
          margin-top: 0.75rem !important;
          margin-bottom: 0.5rem !important;
        }
        .ck-editor__editable_inline h2 {
          font-size: 1.5rem !important;
          font-weight: 700 !important;
          line-height: 2rem !important;
          margin-top: 0.75rem !important;
          margin-bottom: 0.5rem !important;
        }
        .ck-editor__editable_inline h3 {
          font-size: 1.25rem !important;
          font-weight: 600 !important;
          line-height: 1.75rem !important;
          margin-top: 0.5rem !important;
          margin-bottom: 0.375rem !important;
        }
        .ck.ck-toolbar {
          border: none !important;
          border-bottom: 1px solid #e9edf7 !important;
          background: #f8fafc !important;
          border-radius: 0.75rem 0.75rem 0 0 !important;
        }
        .ck.ck-editor__main > .ck-editor__editable {
          border: none !important;
          border-radius: 0 0 0.75rem 0.75rem !important;
          box-shadow: none !important;
        }
        .ck.ck-editor__main > .ck-editor__editable:focus {
          border: none !important;
          box-shadow: none !important;
        }
        .ck-content .image img {
          border-radius: 0.5rem;
        }
      `}</style>
      <CKEditor
        editor={ClassicEditor}
        config={{
          licenseKey: 'GPL',
          ...editorConfiguration,
          placeholder: placeholder || editorConfiguration.placeholder,
        }}
        data={value || ''}
        onChange={(_event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
      />
    </div>
  );
}
