// pages/posts/[id].js

import Layout from '../../components/layout'; // Import the layout wrapper component
import { getAllPostIds, getPostData } from '../../lib/posts'; // Import functions to get post data

// Next.js function to generate all possible paths for this dynamic route
export async function getStaticPaths() {
  const paths = getAllPostIds(); // Get all post IDs from markdown files

  return {
    paths, // Tells Next.js which pages to pre-render at build time
    fallback: false, // Any paths not returned by getStaticPaths will result in a 404 page
  };
}

// This function runs at build time for each post page to get its data
export async function getStaticProps({ params }) {
  const postData = getPostData(params.id); // Get post data for the given ID

  return {
    props: {
      postData, // Pass post data as props to the component
    },
  };
}

// The React component that renders the post page
export default function Post({ postData }) {
  return (
    <Layout>
      <article>
        {/* Post title from front matter */}
        <h1>{postData.title}</h1>

        {/* Post date from front matter */}
        <div>{postData.date}</div>

        {/* Post ID (derived from filename) */}
        <div>{postData.id}</div>

        {/* Raw markdown content (currently not rendered as HTML) */}
        <div>
          <pre>{postData.content}</pre>
        </div>
      </article>
    </Layout>
  );
}
