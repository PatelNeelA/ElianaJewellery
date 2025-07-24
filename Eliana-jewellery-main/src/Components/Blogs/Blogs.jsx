import React from "react";
import blogs1 from "/assets/images/blogs1.png";
import blogs2 from "/assets/images/blogs2.png";
import blogs3 from "/assets/images/blogs3.png";
import blogs4 from "/assets/images/blogs4.png";
import blogs5 from "/assets/images/blogs5.png";
import image from "/assets/images/image.png";

const blogData = [
  {
    img: blogs1,
    title: "Vijay Gems had made deal for changing name",
    desc: "What would be next some expert are....",
    authorImg: blogs4,
    authorName: "Margari john",
    authorRole: "Designer",
    color: "text-black",
  },
  {
    img: blogs2,
    title: "Prepare yourself for some undivided attention.",
    desc: "Amazing new collection by eliana and....",
    authorImg: image,
    authorName: "Arya Stark",
    authorRole: "news& blogs",
    color: "text-[#13524A]",
  },
  {
    img: blogs3,
    title: "For the first time in india take home a diamond",
    desc: "The offer of eliana store is unbelievable.....",
    authorImg: blogs5,
    authorName: "Mira Alber",
    authorRole: "Crafter",
    color: "text-black",
  },
];

const Blogs = () => {
  return (
    <section id="blogs" className="w-full px-4 sm:px-8 md:px-12 lg:px-20 mt-32">
      <h1 className="font-moglan text-[#13524A] text-center text-xl sm:text-2xl">
        Read Our Blogs & News
      </h1>
      <h2 className="font-moglan text-black text-center text-3xl sm:text-4xl md:text-5xl mt-2">
        We're Making News
      </h2>

      <div className="flex flex-wrap justify-center gap-8 mt-16">
        {blogData.map((blog, index) => (
          <div
            key={index}
            className="w-full sm:w-[364px] bg-[#fef5ee] border border-[#13524A] rounded-[9px] card-hover"
          >
            <img
              src={blog.img}
              alt={`blog${index + 1}`}
              className="w-full h-[200px] object-cover rounded-t-[9px]"
            />
            <div className="px-6 py-4">
              <h3 className="font-playfair-display text-lg sm:text-xl text-black mb-1">
                {blog.title}
              </h3>
              <p className="font-playfair-display text-xs sm:text-sm text-black mb-3">
                {blog.desc}
              </p>
              <div className="flex items-center gap-2">
                <img
                  src={blog.authorImg}
                  alt={`author${index + 1}`}
                  className="w-9 h-9 rounded-full"
                />
                <div>
                  <h4 className={`text-sm font-moglan ${blog.color}`}>
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
