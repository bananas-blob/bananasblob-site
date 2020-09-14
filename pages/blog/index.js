import matter from "gray-matter";
import Layout from "../../main/templates/Layout";
import { Posts } from "../../main/index.js";

export default function Index({ title, description, posts }) {
  return (
    <Layout title={title} description={description}>
      <section>
        <ul>
          {posts.map((post, index) => (
            <li key={index}>{post.title}</li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const site = await import("../../content/home.json");
  const blog = await import("../../content/blog.json");
  const posts = await Posts();

  return {
    props: {
      posts,
      title: site.title + site.configuration.titleSeparator + blog.title,
      description: blog.description,
    },
  };
}
