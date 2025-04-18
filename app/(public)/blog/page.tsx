import { gql } from '@apollo/client';
import client from '@/lib/apollo';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

const GET_BLOGS = gql`
  query {
    blogs {
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

export default async function BlogPage() {
  const { data } = await client.query({
    query: GET_BLOGS,
  });

  const blogs = data.blogs as Blog[];

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
          <p className="text-xl text-gray-600">Latest insights and updates from our team</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link 
              href={`/blog/${blog.blogTitle.toLowerCase().replace(/\s+/g, '-')}`}
              key={blog.blogTitle}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48">
                <Image
                  src={blog.thumbnail}
                  alt={blog.blogTitle}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{blog.blogTitle}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{blog.blogContent}</p>
                <div className="flex items-center">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src={blog.Author.pfp}
                      alt={blog.Author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{blog.Author.name}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(blog.datecreated), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
