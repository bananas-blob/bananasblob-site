// import matter from "gray-matter";

import { parseMarkdown } from "next-tinacms-github";

// function NewMarkdownFile({
//   frontmatter,
//   markdownBody,
//   fileRelativePath = null,
// } = {}) {
//   return Object.freeze({
//     frontmatter,
//     markdownBody,
//     fileRelativePath,
//   });
// }

// function Post({ slug, frontmatter, markdownBody } = {}) {
//   const fileRelativePath = `content/posts/${slug}.md`;
//   const markdownFile = NewMarkdownFile({
//     frontmatter,
//     markdownBody,
//     fileRelativePath,
//   });

//   return Object.freeze({
//     slug,
//     markdownFile,
//   });
// }

// export async function getPost(slug) {
//   const postFile = await import(`../content/posts/${slug}.md`);
//   const parsedPostFile = matter(postFile.default);

//   return Post({
//     slug,
//     frontmatter: parsedPostFile.data,
//     markdownBody: parsedPostFile.content,
//   });
// }

// export async function getPosts() {
//   const posts = [];
//   const postsFilesContext = await require.context(
//     "../content/posts",
//     true,
//     /\.md$/
//   );
//   const postsFilesKeys = postsFilesContext.keys();
//   const postsFiles = postsFilesKeys.map(postsFilesContext);

//   postsFilesKeys.forEach((key, index) => {
//     const postFile = postsFiles[index];
//     const parsedPostFile = matter(postFile.default);
//     const post = Post({
//       slug: slugify(key),
//       frontmatter: parsedPostFile.data,
//       markdownBody: parsedPostFile.content,
//     });

//     posts.push(post);
//   });

//   return posts;
// }

function GitFile({ fileRelativePath, data }) {
  return Object.freeze({
    fileRelativePath,
    data,
  });
}

function Post({ slug, data }) {
  return Object.freeze({
    slug,
    gitFile: GitFile({
      fileRelativePath: `content/posts/${slug}.md`,
      data,
    }),
  });
}

export async function getPosts() {
  const posts = [];
  const postsFilesContext = await require.context(
    "../content/posts",
    true,
    /\.md$/
  );
  const postsFilesKeys = postsFilesContext.keys();
  const postsFiles = postsFilesKeys.map(postsFilesContext);

  postsFilesKeys.forEach((key, index) => {
    const postFile = postsFiles[index];
    const data = parseMarkdown(postFile.default);
    const post = Post({
      slug: slugify(key),
      data,
    });

    posts.push(post);
  });

  return posts;
}

export async function getPost(slug) {
  const postFile = await import(`../content/posts/${slug}.md`);
  const data = parseMarkdown(postFile.default);

  return Post({ slug, data });
}

export function postsSlugs() {
  const postsFilesContext = require.context("../content/posts", true, /\.md$/);
  return postsFilesContext.keys().map((key) => slugify(key));
}

function slugify(title = "") {
  return title
    .replace(/^.*[\\\/]/, "")
    .split(".")
    .slice(0, -1)
    .join(".");
}
