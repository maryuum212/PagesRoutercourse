// lib/posts.js

import fs from 'fs'; // Node.js module to read files from the file system
import path from 'path'; // Node.js module to work with file and directory paths
import matter from 'gray-matter'; // Parses front matter (YAML metadata) from markdown files

import { remark } from 'remark';
import html from 'remark-html';

// Get the full path to the 'posts' directory
const postsDirectory = path.join(process.cwd(), 'posts');

// Function to get all posts and sort them by date
export function getSortedPostsData() {
  // Get all file names in the 'posts' directory (e.g., ['my-post.md'])
  const fileNames = fs.readdirSync(postsDirectory);

  // Loop through each file name
  const allPostsData = fileNames.map((fileName) => {
    // Remove the '.md' extension to get the post ID
    const id = fileName.replace(/\.md$/, '');

    // Get the full path to the markdown file
    const fullPath = path.join(postsDirectory, fileName);

    // Read the file contents as a string
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the front matter (metadata) and content
    const matterResult = matter(fileContents);

    // Return an object with the post ID and metadata (like title and date)
    return {
      id,
      ...matterResult.data,
    };
  });

  // Sort posts by date (newest first)
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// Function to return a list of all post IDs
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);

  // Map each file name to the format required by Next.js for dynamic routes
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''), // remove ".md" to get the ID
      },
    };
  });
}

// Function to get the data for a single post
export async function getPostData(id) {
  // Build the full path to the file based on the given ID
  const fullPath = path.join(postsDirectory, `${id}.md`);

  // Read the file's contents
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Parse the file using gray-matter to extract metadata and content
  const matterResult = matter(fileContents);
  //use remark to convert markdown into html string
  const processedContent = await remark()
  .use(html)
  .process(matterResult.content)
  const contentHtml = processedContent.toString();

  // Return the post ID, metadata (e.g. title, date), and the raw markdown content
  return {
    id,

       contentHtml,
    ...matterResult.data,
    //content: matterResult.content,
  };
}
