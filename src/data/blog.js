import { getCollection } from 'astro:content';

export async function getBlogPosts(lang) {
  const posts = await getCollection('blog', (post) => post.lang === lang);
  return posts.map(post => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt || post.body.slice(0, 150) + '...',  // Truncate body to get an excerpt
    slug: post.slug
  }));
}
