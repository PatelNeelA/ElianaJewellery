import React, { useState, useEffect } from "react";
import blogService from "../../Service/blogService"; // Import blogService

const Blogs = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await blogService.getAllBlogPosts();
        setBlogPosts(data);
      } catch (err) {
        setError("Failed to load blog posts.");
        console.error("Error fetching blog posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogPosts();
  }, []);

  if (loading) {
    return <div className="text-center mt-32">Loading Blogs...</div>;
  }

  if (error) {
    return <div className="text-center mt-32 text-red-500">{error}</div>;
  }

  // Display a message if no blog posts are found
  if (blogPosts.length === 0) {
    return (
      <section
        id="blogs"
        className="w-full px-4 sm:px-8 md:px-12 lg:px-20 mt-32 text-center"
      >
        <h1 className="font-moglan text-[#13524A] text-center text-xl sm:text-2xl">
          Read Our Blogs & News
        </h1>
        <h2 className="font-moglan text-black text-center text-3xl sm:text-4xl md:text-5xl mt-2 mb-16">
          We're Making News
        </h2>
        <p className="text-gray-600 text-base sm:text-lg">
          No blog posts available. Check back soon!
        </p>
      </section>
    );
  }

  return (
    <section id="blogs" className="w-full px-4 sm:px-8 md:px-12 lg:px-20 mt-32">
      <h1 className="font-moglan text-[#13524A] text-center text-xl sm:text-2xl">
        Read Our Blogs & News
      </h1>
      <h2 className="font-moglan text-black text-center text-3xl sm:text-4xl md:text-5xl mt-2">
        We're Making News
      </h2>

      <div className="flex flex-wrap justify-center gap-8 mt-16">
        {blogPosts.map((blog, index) => (
          <div
            key={blog._id} // Use MongoDB _id as key
            className="w-full sm:w-[364px] bg-[#fef5ee] border border-[#13524A] rounded-[9px] card-hover shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
          >
            <img
              src={`http://localhost:5000${blog.blogImageUrl}`} // Use blogImageUrl from backend
              alt={blog.title}
              className="w-full h-[200px] object-cover rounded-t-[9px]"
            />
            <div className="px-6 py-4">
              <h3 className="font-playfair-display text-lg sm:text-xl text-black mb-1">
                {blog.title}
              </h3>
              <p className="font-playfair-display text-xs sm:text-sm text-black mb-3">
                {blog.description} 
              </p>
              <div className="flex items-center gap-2">
                <img
                  src={`http://localhost:5000${blog.authorImageUrl}`} // Use authorImageUrl from backend
                  alt={blog.authorName}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <h4
                    className={`text-sm font-moglan ${
                      blog.authorTextColor || "text-black"
                    }`}
                  >
                    {" "}
                    {/* Use dynamic color */}
                    {blog.authorName}
                  </h4>
                  <p className="text-[10px] font-moglan">{blog.authorRole}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Blogs;
