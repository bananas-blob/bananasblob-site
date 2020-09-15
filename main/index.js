import { parseMarkdown } from "next-tinacms-github";

export function googleDirectLink(sharebleLink = "") {
  const id = sharebleLink.split("/").slice(-2)[0];
  return `https://drive.google.com/uc?export=view&id=${id}`;
}

function GitFile({ fileRelativePath, data }) {
  return Object.freeze({
    fileRelativePath,
    data,
  });
}

function Site({ data }) {
  const gitFile = GitFile({
    fileRelativePath: `content/home.json`,
    data,
  });

  return Object.freeze({
    gitFile,
  });
}

export async function getSite() {
  const siteFile = await import("../content/home.json");
  const data = siteFile.default;
  return Site({ data });
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

export async function getPost(slug) {
  const postFile = await import(`../content/posts/${slug}.md`);
  console.log({ slug, postFile });
  const data = parseMarkdown(postFile.default);

  return Post({ slug, data });
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
