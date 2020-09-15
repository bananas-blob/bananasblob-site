import * as React from "react";
import ReactMarkdown from "react-markdown";
import { postsSlugs, getPost } from "../../main";
import Layout from "../../main/templates/Layout";
import { useForm, usePlugin } from "tinacms";
import { InlineForm } from "react-tinacms-inline";
import { InlineWysiwyg } from "react-tinacms-editor";
import { parseMarkdown, getGithubPreviewProps } from "next-tinacms-github";
import { useGithubMarkdownForm } from "react-tinacms-github";

export default function BlogPost({ post, pageTitle }) {
  const formOptions = {
    label: "Home",
    fields: [
      { name: "frontmatter.title", component: "text", label: "Título" },
      {
        name: "frontmatter.description",
        component: "text",
        label: "Descrição",
      },
      { name: "frontmatter.author", component: "text", label: "Autor" },
    ],
  };

  const [data, form] = useGithubMarkdownForm(post.gitFile, formOptions);
  const { markdownBody, frontmatter } = data;
  const { title, description, author } = frontmatter;

  return (
    <Layout title={pageTitle} description={description}>
      <article className="post">
        <div>
          <h1>{title}</h1>
          <InlineForm form={form}>
            <InlineWysiwyg name="markdownBody" format="markdown">
              <ReactMarkdown source={markdownBody} />
            </InlineWysiwyg>
          </InlineForm>
        </div>
      </article>
    </Layout>
  );
}

export async function getStaticProps({ preview, previewData, params }) {
  const site = await import("../../content/home.json");
  const { slug } = params;
  if (preview) {
    return getGithubPreviewProps({
      ...previewData,
      fileRelativePath: `content/posts/${slug}.md`,
      parse: parseMarkdown,
    });
  }

  const post = await getPost(slug);
  const { title } = post.gitFile.data.frontmatter;
  return {
    props: {
      sourceProvider: null,
      error: null,
      preview: false,
      pageTitle: site.title + site.configuration.titleSeparator + title,
      post,
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
