// components/Admin/ManageCollection.jsx
import React, { useState, useEffect } from "react";
import collectionService from "../../Service/collectionService"; // Adjust path as needed

const ManageCollection = () => {
  const [collections, setCollections] = useState([]);
  const [collectionName, setCollectionName] = useState("");
  const [collectionImage, setCollectionImage] = useState(null);
  const [editingCollection, setEditingCollection] = useState(null); // State to hold collection being edited
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await collectionService.getCollections();
      setCollections(data);
    } catch (err) {
      setError("Failed to fetch collections.");
      console.error("Error fetching collections:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setCollectionImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!collectionName || (!collectionImage && !editingCollection)) {
      setError(
        "Please provide a collection name and an image (for new collections)."
      );
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", collectionName);
    if (collectionImage) {
      formData.append("collectionImage", collectionImage); // 'collectionImage' must match backend multer field name
    }

    try {
      if (editingCollection) {
        // Update existing collection
        const result = await collectionService.updateCollection(
          editingCollection._id,
          formData
        );
        setSuccess(result.message);
      } else {
        // Create new collection
        const result = await collectionService.createCollection(formData);
        setSuccess(result.message);
      }
      setCollectionName("");
      setCollectionImage(null);
      setEditingCollection(null); // Clear editing state
      e.target.reset(); // Reset file input
      fetchCollections(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
      console.error("Error submitting collection:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (collection) => {
    setEditingCollection(collection);
    setCollectionName(collection.name);
    setCollectionImage(null); // Clear image input when editing, user can re-upload
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this collection?")) {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const result = await collectionService.deleteCollection(id);
        setSuccess(result.message);
        fetchCollections(); // Refresh the list
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete collection.");
        console.error("Error deleting collection:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Manage Collections
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-8"
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          {editingCollection ? "Edit Collection" : "Add New Collection"}
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <div className="mb-4">
          <label
            htmlFor="collectionName"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Collection Name:
          </label>
          <input
            type="text"
            id="collectionName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="collectionImage"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Collection Image:
          </label>
          <input
            type="file"
            id="collectionImage"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            onChange={handleFileChange}
            accept="image/*"
            required={!editingCollection} // Required only if not editing
          />
          {editingCollection && editingCollection.imageUrl && (
            <p className="text-sm text-gray-600 mt-2">
              Current Image:{" "}
              <a
                href={`http://localhost:5000${editingCollection.imageUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Current Image
              </a>
              <br />
              (Upload new image to replace)
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : editingCollection
              ? "Update Collection"
              : "Add Collection"}
          </button>
          {editingCollection && (
            <button
              type="button"
              onClick={() => {
                setEditingCollection(null);
                setCollectionName("");
                setCollectionImage(null);
                setError(null);
                setSuccess(null);
              }}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Existing Collections
        </h2>
        {loading && <p>Loading collections...</p>}
        {collections.length === 0 && !loading && <p>No collections found.</p>}
        {collections.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Image
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
                {collections.map((collection) => (
                  <tr key={collection._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {collection.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {collection.imageUrl && (
                        <img
                          src={`http://localhost:5000${collection.imageUrl}`} // Adjust base URL as needed
                          alt={collection.name}
                          className="h-16 w-16 object-cover rounded-md"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(collection)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(collection._id)}
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

export default ManageCollection;
