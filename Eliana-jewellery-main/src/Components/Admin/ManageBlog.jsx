// components/Admin/ManageBlog.jsx (UI & Responsiveness Modified)
import React, { useState, useEffect } from "react";
import blogService from "../../Service/blogService";

const ManageBlog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [blogImage, setBlogImage] = useState(null);
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [authorImage, setAuthorImage] = useState(null);
  const [authorTextColor, setAuthorTextColor] = useState("text-black");

  const [editingBlog, setEditingBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.getAllBlogPosts();
      setBlogPosts(data);
    } catch (err) {
      setError("Failed to fetch blog posts.");
      console.error("Error fetching blog posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBlogImageChange = (e) => {
    setBlogImage(e.target.files[0]);
  };

  const handleAuthorImageChange = (e) => {
    setAuthorImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (
      !title ||
      !description ||
      !authorName ||
      !authorRole ||
      (!blogImage && !editingBlog) ||
      (!authorImage && !editingBlog)
    ) {
      setError("Please fill in all required fields and provide both images.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("authorName", authorName);
    formData.append("authorRole", authorRole);
    formData.append("authorTextColor", authorTextColor);

    if (blogImage) {
      formData.append("blogImage", blogImage);
    }
    if (authorImage) {
      formData.append("authorImage", authorImage);
    }

    try {
      if (editingBlog) {
        const result = await blogService.updateBlogPost(
          editingBlog._id,
          formData
        );
        setSuccess(result.message);
      } else {
        const result = await blogService.createBlogPost(formData);
        setSuccess(result.message);
      }
      setTitle("");
      setDescription("");
      setBlogImage(null);
      setAuthorName("");
      setAuthorRole("");
      setAuthorImage(null);
      setAuthorTextColor("text-black");
      setEditingBlog(null);
      e.target.reset();
      fetchBlogPosts();
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
      console.error("Error submitting blog post:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setDescription(blog.description);
    setAuthorName(blog.authorName);
    setAuthorRole(blog.authorRole);
    setAuthorTextColor(blog.authorTextColor || "text-black");
    setBlogImage(null);
    setAuthorImage(null);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const result = await blogService.deleteBlogPost(id);
        setSuccess(result.message);
        fetchBlogPosts();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete blog post.");
        console.error("Error deleting blog post:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingBlog(null);
    setTitle("");
    setDescription("");
    setBlogImage(null);
    setAuthorName("");
    setAuthorRole("");
    setAuthorImage(null);
    setAuthorTextColor("text-black");
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-[#f3ece6]">
      {" "}
      {/* Main container background */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Manage Blog Posts
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-[#fef5ee] border border-[#13524a] rounded-lg p-6 shadow-lg mb-8"
      >
        <h2 className="text-2xl font-moglan text-[#13524a] text-center mb-6">
          {" "}
          {/* Heading style */}
          {editingBlog ? "Edit Blog Post" : "Add New Blog Post"}
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 text-sm font-moglan mb-2"
            >
              {" "}
              {/* Label font */}
              Blog Title:
            </label>
            <input
              type="text"
              id="title"
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-[#13524a] focus:border-[#13524a] text-sm md:text-base"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="blogImage"
              className="block text-gray-700 text-sm font-moglan mb-2"
            >
              {" "}
              {/* Label font */}
              Blog Main Image:
            </label>
            <input
              type="file"
              id="blogImage"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={handleBlogImageChange}
              accept="image/*"
              required={!editingBlog}
            />
            {editingBlog && editingBlog.blogImageUrl && (
              <p className="text-sm text-gray-600 mt-2">
                Current:{" "}
                <a
                  href={`http://localhost:5000${editingBlog.blogImageUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#13524a] hover:underline"
                >
                  {" "}
                  {/* Link color */}
                  View Image
                </a>
              </p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-moglan mb-2"
          >
            {" "}
            {/* Label font */}
            Description:
          </label>
          <textarea
            id="description"
            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-[#13524a] focus:border-[#13524a] text-sm md:text-base h-24 resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label
              htmlFor="authorName"
              className="block text-gray-700 text-sm font-moglan mb-2"
            >
              {" "}
              {/* Label font */}
              Author Name:
            </label>
            <input
              type="text"
              id="authorName"
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-[#13524a] focus:border-[#13524a] text-sm md:text-base"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="authorRole"
              className="block text-gray-700 text-sm font-moglan mb-2"
            >
              {" "}
              {/* Label font */}
              Author Role:
            </label>
            <input
              type="text"
              id="authorRole"
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-[#13524a] focus:border-[#13524a] text-sm md:text-base"
              value={authorRole}
              onChange={(e) => setAuthorRole(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="authorImage"
              className="block text-gray-700 text-sm font-moglan mb-2"
            >
              {" "}
              {/* Label font */}
              Author Image:
            </label>
            <input
              type="file"
              id="authorImage"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={handleAuthorImageChange}
              accept="image/*"
              required={!editingBlog}
            />
            {editingBlog && editingBlog.authorImageUrl && (
              <p className="text-sm text-gray-600 mt-2">
                Current:{" "}
                <a
                  href={`http://localhost:5000${editingBlog.authorImageUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#13524a] hover:underline"
                >
                  {" "}
                  {/* Link color */}
                  View Image
                </a>
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="authorTextColor"
              className="block text-gray-700 text-sm font-moglan mb-2"
            >
              {" "}
              {/* Label font */}
              Author Text Color:
            </label>
            <select
              id="authorTextColor"
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-[#13524a] focus:border-[#13524a] text-sm md:text-base"
              value={authorTextColor}
              onChange={(e) => setAuthorTextColor(e.target.value)}
            >
              <option value="text-black">Black</option>
              <option value="text-[#13524A]">Teal</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between mt-6">
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#13524a] hover:bg-[#18544d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#13524a] disabled:opacity-50"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : editingBlog
              ? "Update Blog Post"
              : "Add Blog Post"}
          </button>
          {editingBlog && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
      <div className="bg-[#fef5ee] border border-[#13524a] p-6 rounded-lg shadow-lg">
        {" "}
        {/* Table card style */}
        <h2 className="text-2xl font-moglan text-[#13524a] text-center mb-6">
          {" "}
          {/* Heading style */}
          Existing Blog Posts
        </h2>
        {loading && <p>Loading blog posts...</p>}
        {blogPosts.length === 0 && !loading && <p>No blog posts found.</p>}
        {blogPosts.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Author
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Blog Image
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Author Image
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogPosts.map((blog) => (
                  <tr key={blog._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{blog.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {blog.authorName} ({blog.authorRole})
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {blog.blogImageUrl && (
                        <img
                          src={`http://localhost:5000${blog.blogImageUrl}`}
                          alt="Blog"
                          className="h-16 w-16 object-cover rounded-md"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {blog.authorImageUrl && (
                        <img
                          src={`http://localhost:5000${blog.authorImageUrl}`}
                          alt="Author"
                          className="h-16 w-16 object-cover rounded-full"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="text-[#13524a] hover:text-[#18544d] mr-4" /* Link-like button color */
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBlog;
