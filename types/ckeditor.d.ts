declare module 'ckeditor5' {
  export const ClassicEditor: any;
  export const Essentials: any;
  export const Paragraph: any;
  export const Heading: any;
  export const Bold: any;
  export const Italic: any;
  export const Underline: any;
  export const Strikethrough: any;
  export const Link: any;
  export const List: any;
  export const BlockQuote: any;
  export const Table: any;
  export const TableToolbar: any;
  export const TableProperties: any;
  export const TableCellProperties: any;
  export const TableColumnResize: any;
  export const TableCaption: any;
  export const MediaEmbed: any;
  export const Indent: any;
  export const Undo: any;
  export const Image: any;
  export const ImageBlock: any;
  export const ImageInline: any;
  export const ImageTextAlternative: any;
  export const ImageToolbar: any;
  export const ImageCaption: any;
  export const ImageStyle: any;
  export const ImageResize: any;
  export const ImageResizeEditing: any;
  export const ImageResizeHandles: any;
  export const ImageResizeButtons: any;
  export const ImageUpload: any;
  export const ImageInsert: any;
  export const FileRepository: any;
  export const Autoformat: any;
  export const Alignment: any;
  export const ButtonView: any;
  export const Plugin: any;
}

declare module '@ckeditor/ckeditor5-react' {
  import React from 'react';
  export const CKEditor: React.ComponentType<{
    editor: any;
    data?: string;
    config?: any;
    onChange?: (event: any, editor: any) => void;
    onReady?: (editor: any) => void;
    onBlur?: (event: any, editor: any) => void;
    onFocus?: (event: any, editor: any) => void;
    onError?: (error: any, details: any) => void;
  }>;
}
