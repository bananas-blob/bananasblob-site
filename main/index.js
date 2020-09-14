import path from "path";
import matter from "gray-matter";

export async function Post(fileRelativeDir, slug) {
  const postFile = await require(`../content/posts/${slug}.md`);
  const parsedPostFile = matter(postFile.default);

  console.log({ fileRelativePath: fileRelativeDir + `/${slug}.md` });

  return NewMarkdownFile({
    slug,
    frontmatter: parsedPostFile.data,
    markdownBody: parsedPostFile.content,
    fileRelativePath: fileRelativeDir + `/${slug}.md`,
  });
}

export async function Posts() {
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
    const parsedPostFile = matter(postFile.default);
    const post = NewMarkdownFile({
      slug: slugify(key),
      frontmatter: parsedPostFile.data,
      markdownBody: parsedPostFile.content,
    });

    posts.push(post);
  });

  return posts;
}

export function postsSlugs() {
  const postsFilesContext = require.context("../content/posts", true, /\.md$/);
  return postsFilesContext.keys().map((key) => slugify(key));
}

function NewMarkdownFile({
  slug,
  frontmatter,
  markdownBody,
  fileRelativePath = null,
} = {}) {
  return Object.freeze({
    slug,
    frontmatter,
    markdownBody,
    fileRelativePath,
  });
}

function slugify(title = "") {
  return title
    .replace(/^.*[\\\/]/, "")
    .split(".")
    .slice(0, -1)
    .join(".");
}
