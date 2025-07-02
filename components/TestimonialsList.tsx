'use client';

import { Quote } from 'lucide-react';
import Image from 'next/image';
import { testimonialData } from './Testimonials';

export function TestimonialsList() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-purple-600 mb-4">What Our Clients Say</h2>
          <p className="text-lg text-gray-600">Real experiences from people we've helped</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {testimonialData.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl shadow-lg p-6 md:p-8 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Image Section */}
                <div className="flex-shrink-0">
                  <div className="relative w-20 h-20 md:w-24 md:h-24">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="rounded-full object-cover border-4 border-purple-100"
                    />
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 space-y-4">
                  <div className="relative">
                    <Quote className="w-8 h-8 text-purple-200 absolute -top-2 -left-2" />
                    <p className="text-gray-700 text-base md:text-lg leading-relaxed pl-6">
                      {testimonial.testimonial}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                        {testimonial.name}
                      </h3>
                      <p className="text-purple-600 font-medium">
                        {testimonial.role}
                      </p>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, index) => (
                        <svg
                          key={index}
                          className="w-5 h-5 text-yellow-400 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 