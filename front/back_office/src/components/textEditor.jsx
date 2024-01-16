import React, {useEffect, useRef} from 'react';
import { Editor } from '@tinymce/tinymce-react';

export const TextEditor = ({defaultValue, OnChange}) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (!OnChange)
      return;
    const intervalId = setInterval(() => {
      OnChange(editorRef.current.getContent());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [OnChange]);
  
  if (!OnChange)
    return <div>Erreur : OnChange n'est pas défini</div>
  
  return (
    <div className={"container"}>
      <Editor
        tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
        onInit={(evt, editor) => {
          if (!editorRef.current) {
            editorRef.current = editor;
            editorRef.current.setContent(defaultValue);
          }
        }}
        initialValue={defaultValue}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
            'anchor', 'searchreplace', 'visualblocks',
            'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount', 'accordion', 'emoticons',
          ],
          toolbar: `
            undo redo | 
            removeformat | 
            bold italic forecolor backcolor | 
            fontfamily | fontsize | blocks |
            alignleft aligncenter alignright alignjustify | 
            bullist numlist | 
            outdent indent |            
            image media link charmap emoticons accordion | 
            help
          `,
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14pt }'
        }}
      />
    </div>
  );
}
