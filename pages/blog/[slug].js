import * as React from "react";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
// const glob = require("glob");

import { Post, postsSlugs } from "../../main";
import Layout from "../../main/templates/Layout";
import { useMarkdownForm } from "next-tinacms-markdown";

export default function BlogTemplate({ post, pageTitle }) {
  const [postForm] = useMarkdownForm(post, formOptions());
  const { frontmatter, markdownBody } = postForm;

  return (
    <Layout title={pageTitle} description={frontmatter.description}>
      <article className="post">
        <div>
          <h1>{frontmatter.title}</h1>
          <ReactMarkdown source={markdownBody} />
        </div>
      </article>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  const site = await import("../../content/home.json");
  const { slug } = params;
  const post = await Post("../../content/posts", slug);

  return {
    props: {
      post,
      pageTitle:
        site.title + site.configuration.titleSeparator + post.frontmatter.title,
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

function formOptions() {
  return {
    label: "Post",
    fields: [
      // {
      //   label: "Hero Image",
      //   name: "frontmatter.hero_image",
      //   component: "image",
      //   // Generate the frontmatter value based on the filename
      //   parse: (filename) => `../static/images/${filename}`,

      //   // Decide the file upload directory for the post
      //   uploadDir: () => "/public/static/images/",

      //   // Generate the src attribute for the preview image.
      //   previewSrc: (data) => `/static/images/${data.frontmatter.hero_image}`,
      //   imageProps: async function upload(files) {
      //     const directory = "public/static/";
      //     console.log("file from upload", file);
      //     let media = await cms.media.store.persist(
      //       files.map((file) => ({
      //         directory,
      //         file,
      //       }))
      //     );

      //     return media.map((m) => `/${m.filename}`);
      //   },
      // },
      {
        name: "frontmatter.title",
        label: "Título",
        component: "text",
      },
      {
        name: "frontmatter.date",
        label: "Data",
        component: "date",
      },
      {
        name: "frontmatter.author",
        label: "Autor",
        component: "text",
      },
      {
        name: "markdownBody",
        label: "Conteúdo",
        component: "markdown",
      },
    ],
  };
}
