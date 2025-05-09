import React, { useState, useEffect } from 'react';
import axios from 'axios';
import videoBg1 from "../imgs/videoBg1.mp4";
import port4 from "../imgs/port4.png";
import port1 from "../imgs/port1.jpg";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openBlogId, setOpenBlogId] = useState(null);
  const [bgColorIndex, setBgColorIndex] = useState(0);

  const colors = ["#ffffff", "#f8f9fa", "#e9ecef", "#dee2e6", "#f1f3f5"];

  useEffect(() => {
    fetchLatestBlogs();
    const interval = setInterval(() => {
      setBgColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchLatestBlogs = () => {
    setLoading(true);
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + '/latest-blogs')
      .then((response) => {
        setBlogs(response.data.blogs);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
        setError(err);
        setLoading(false);
      });
  };

  if (loading) return <div className="text-center text-xl mt-10">Loading blogs...</div>;
  if (error) return <div className="text-center text-xl text-red-500 mt-10">Error: {error.message}</div>;

  const handleTitleClick = (blogId) => {
    setOpenBlogId(prevId => prevId === blogId ? null : blogId);
  };

  return (
    <div className="w-full min-h-screen font-philosopher">
      <video className="fixed inset-0 object-cover w-full h-full" src={videoBg1} autoPlay loop muted />
      <div className="relative inset-0 bg-black opacity-90"></div>

      <section 
        className="rounded-3xl min-h-screen mt-28 md:mt-28 flex flex-col items-center justify-start text-center px-4 md:px-16 relative z-5 animate-fade-in w-full"
        style={{
          backgroundImage: `url(${port1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(1.5) opacity(0.89)",
        }}
      >
        <div 
          className="relative z-10 w-full max-w-7xl mx-auto p-6 sm:p-10 rounded-lg transition-all bg-[#263340] duration-500 shadow-xl"
          // style={{ backgroundColor:"#e6ffe6" }}
        >
          <h2 className="text-2xl sm:text-2xl font-bold mb-6 text-white">Latest Blogs</h2>
          {blogs.length > 0 ? (
            blogs.map((blog) => {
              const hasContent = blog.content?.[0]?.blocks?.length > 0;
              const isOpen = openBlogId === blog.blog_id;

              return (
                <div 
                  key={blog.blog_id} 
                  className="border border-[#2ecc40] p-4 sm:p-6 mb-6 rounded-md shadow-md transition-transform duration-300 hover:shadow-2xl hover:-translate-y-2 w-full"
                >
                  <h3
                    className="text-xl sm:text-2xl font-semibold mb-3 text-white cursor-pointer hover:text-[#2ecc40]"
                    onClick={() => handleTitleClick(blog.blog_id)}
                  >
                    Title: {blog.title}
                  </h3>
                  <p className="mb-4 text-white leading-relaxed text-sm sm:text-base ">Description: {blog.des}</p>
                  {blog.banner && (
                    <img 
                      src={blog.banner} 
                      alt="Blog Banner" 
                      className="mb-4 rounded-md w-full object-cover max-h-[200px] min-h-[200px]"
                    />
                  )}
                  {isOpen && hasContent && (
                    <div className="mb-4 text-[#2ecc40] leading-relaxed text-sm sm:text-base">
                      Content: {blog.content[0].blocks.map((block, index) => (
                        <p key={index}>{block.data.text}</p>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-sm text-white">Author: {blog.author.personal_info.username}</p>
                    <div className="text-sm text-white ">
                      Tags: {blog.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-600">No blogs found.</p>
          )}
        </div>
      </section>

      <footer
        className="rounded-3xl min-h-[20vh] mt-2 flex flex-col justify-between text-center bg-transparent text-white relative z-10 w-full"
        style={{
          backgroundImage: `url(${port4})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(1) opacity(0.89)",
        }}
      >
        <div className="flex flex-col items-center p-4 sm:p-6 md:p-16">
          <div className="flex justify-center flex-wrap space-x-4 mb-4 text-sm sm:text-base">
            <a href="https://www.linkedin.com/login" className="text-white hover:text-[#7de649]">LinkedIn</a>
            <a href="https://www.youtube.com/" className="text-white hover:text-[#7de649]">YouTube</a>
            <a href="https://www.facebook.com/" className="text-white hover:text-[#7de649]">Facebook</a>
            <a href="https://x.com/i/flow/login" className="text-white hover:text-[#7de649]">Twitter</a>
          </div>
          <div className="text-sm text-center mb-4">
            <p>Mail: info@portfolio.com | Phone: 456 589-5364 | Address: 123 Main St</p>
          </div>
          <div className="border-t border-gray-400 pt-4 text-center text-xs">
            <p>&copy; 2024 Your Portfolio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogPage;
