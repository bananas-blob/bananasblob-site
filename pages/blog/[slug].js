import * as React from "react";
import ReactMarkdown from "react-markdown";
import { postsSlugs, getPost, Site, googleDirectLink } from "../../main";
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
        name: "frontmatter.image",
        component: "text",
        label: "Link da Imagem",
      },
      {
        label: "Imagem",
        name: "frontmatter.image",
        description: "Imagem do Post",
        component: "group",
        fields: [
          {
            name: "link",
            component: "text",
            label: "Link do Google Drive",
          },
          {
            name: "alt",
            component: "text",
            label: "Name",
          },
        ],
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
          <img
            src={googleDirectLink(data.frontmatter.image.link)}
            alt={data.frontmatter.image.alt}
          ></img>
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
