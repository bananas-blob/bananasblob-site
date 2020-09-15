import * as React from "react";
import ReactMarkdown from "react-markdown";
import { postsSlugs, getPost, Site } from "../../main";
import Layout from "../../main/templates/Layout";
import { InlineForm } from "react-tinacms-inline";
import { InlineWysiwyg } from "react-tinacms-editor";
import { parseMarkdown, getGithubPreviewProps } from "next-tinacms-github";
import { useGithubMarkdownForm } from "react-tinacms-github";
import { usePlugin } from "tinacms";

export default function BlogPost({ file, pageTitle }) {
  const formOptions = {
    label: "Home",
    fields: [
      {
        label: "Hero Image",
        name: "frontmatter.hero_image",
        component: "image",
        // Generate the frontmatter value based on the filename
        parse: (filename) => `../static/images/${filename}`,

        // Decide the file upload directory for the post
        uploadDir: () => "/public/static/images/",

        // Generate the src attribute for the preview image.
        previewSrc: (data) => `/images/${data.frontmatter.hero_image}`,
        imageProps: async function upload(files) {
          const directory = "public/static/images/";
          console.log("file from upload", file);
          let media = await cms.media.store.persist(
            files.map((file) => ({
              directory,
              file,
            }))
          );

          return media.map((m) => `/${m.filename}`);
        },
      },
      {
        name: "frontmatter.image",
        component: "text",
        label: "Link da Imagem",
      },
      {
        name: "frontmatter.title",
        component: "text",
        label: "Título",
      },
      {
        name: "frontmatter.description",
        component: "text",
        label: "Descrição",
      },
      {
        name: "frontmatter.author",
        component: "text",
        label: "Autor",
      },
      // {
      //   name: "markdownBody",
      //   component: "markdown",
      //   label: "Post",
      // },
    ],
  };

  const [data, form] = useGithubMarkdownForm(file, formOptions);
  usePlugin(form);

  return (
    <Layout title={"pageTitle"} description={data.frontmatter.description}>
      <article className="post">
        <div>
          <h1>{data.frontmatter.title}</h1>
          <img src={data.frontmatter.image}></img>
          <InlineForm form={form}>
            <InlineWysiwyg name="markdownBody" format="markdown">
              <ReactMarkdown source={data.markdownBody} />
            </InlineWysiwyg>
          </InlineForm>
        </div>
      </article>
    </Layout>
  );
}

export async function getStaticProps({ preview, previewData, params }) {
  const { slug } = params;

  if (preview) {
    return getGithubPreviewProps({
      ...previewData,
      fileRelativePath: `content/posts/${slug}.md`,
      parse: parseMarkdown,
    });
  }

  const postFile = await import(`../../content/posts/${slug}.md`);
  const data = parseMarkdown(postFile.default);
  const { title: postTitle } = data.frontmatter;

  return {
    props: {
      sourceProvider: null,
      error: null,
      preview: false,
      // title: site.title,
      file: {
        fileRelativePath: `content/posts/${slug}.md`,
        data,
      },
    },
  };
}

export async function getStaticPaths() {
  const paths = postsSlugs().map((slug) => `/blog/${slug}`);

  return {
    paths,
    fallback: false,
  };
}

// function formOptions(post) {
//   const { title, date, author } = post.markdownFile.frontmatter;
//   const { markdownBody } = post.markdownFile;

//   return {
//     id: "AAAAAAHhhhh",
//     label: "Post",
//     fields: [
//       {
//         name: "title",
//         label: "Título",
//         component: "text",
//       },
//       {
//         name: "date",
//         label: "Data",
//         component: "date",
//       },
//       {
//         name: "author",
//         label: "Autor",
//         component: "text",
//       },
//       {
//         name: "markdownBody",
//         label: "Conteúdo",
//         component: "markdown",
//       },
//     ],
//     initialValues: {
//       title,
//       date,
//       author,
//       markdownBody,
//     },
//     onSubmit(data) {
//       alert(data);
//       // return cms.api.git
//       //   .writeToDisk({
//       //     fileRelativePath: props.fileRelativePath,
//       //     content: toMarkdownString(data),
//       //   })
//       //   .then(() => {
//       //     return cms.api.git.commit({
//       //       files: [props.fileRelativePath],
//       //       message: `Commit from Tina: Update ${data.fileRelativePath}`,
//       //     });
//       //   });
//     },
//     onChange() {
//       alert("Changed!");
//     },
//   };
// }
