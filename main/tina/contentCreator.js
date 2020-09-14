export const BlogPostCreatorPlugin = {
  __type: "content-creator",
  fields: [
    {
      label: "Título",
      name: "title",
      component: "text",
      validation(title) {
        if (!title) return "Campo necessário";
      },
    },
    {
      label: "Data",
      name: "date",
      component: "date",
      description: "O valor padrão é hoje",
    },
    {
      label: "Autor",
      name: "author_name",
      component: "text",
      description: "Quem escreveu esse artigo?",
    },
  ],
  onSubmit(values, cms) {
    // Call functions that create the new blog post. For example:
    cms.apis.someBackend.createPost(values);
  },
};
