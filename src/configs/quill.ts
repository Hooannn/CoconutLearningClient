const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent

    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ align: [] }],
    ['link', 'image'],
    ['clean'], // remove formatting button
  ],
};

const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block', 'list', 'bullet', 'indent', 'link', 'image'];
export { modules, formats };
