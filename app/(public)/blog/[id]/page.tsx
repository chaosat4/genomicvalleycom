import { gql } from '@apollo/client';
import client from '@/lib/apollo';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';

const GET_BLOG = gql`
  query GetBlog($id: ID!) {
    blog(id: $id) {
      blogTitle
      thumbnail
      blogContent
      Author {
        name
        pfp
      }
      datecreated
    }
  }
`;

interface Blog {
  blogTitle: string;
  thumbnail: string;
  blogContent: string;
  Author: {
    name: string;
    pfp: string;
  };
  datecreated: string;
}

export default async function BlogDetailPage({ params }: { params: { id: string } }) {
  const { data } = await client.query({
    query: GET_BLOG,
    variables: { id: params.id }
  });

  if (!data.blog) {
    notFound();
  }

  const blog = data.blog as Blog;

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          href="/blog"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <svg
            className="h-5 w-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Blogs
        </Link>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-[400px] w-full">
            <Image
              src={blog.thumbnail}
              alt={blog.blogTitle}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.blogTitle}</h1>
            
            <div className="flex items-center mb-8">
              <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                <Image
                  src={blog.Author.pfp}
                  alt={blog.Author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">{blog.Author.name}</p>
                <p className="text-gray-500">
                  {format(new Date(blog.datecreated), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>

            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.blogContent }}
            />
          </div>
        </article>
      </div>
    </div>
  );
}
