import React, { useState, useEffect } from "react";
import collectionService from "../../Service/collectionService";

const ManageCollection = () => {
  const [collections, setCollections] = useState([]);
  const [collectionName, setCollectionName] = useState("");
  const [collectionImage, setCollectionImage] = useState(null);
  const [isTrending, setIsTrending] = useState(false);

  const [editingCollection, setEditingCollection] = useState(null);
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
    formData.append("isTrending", isTrending);
    if (collectionImage) {
      formData.append("collectionImage", collectionImage);
    }

    try {
      if (editingCollection) {
        const result = await collectionService.updateCollection(
          editingCollection._id,
          formData
        );
        setSuccess(result.message);
      } else {
        const result = await collectionService.createCollection(formData);
        setSuccess(result.message);
      }
      setCollectionName("");
      setCollectionImage(null);
      setIsTrending(false);
      setEditingCollection(null);
      e.target.reset();
      fetchCollections();
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
    setCollectionImage(null);
    setIsTrending(collection.isTrending || false);
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
        fetchCollections();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete collection.");
        console.error("Error deleting collection:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingCollection(null);
    setCollectionName("");
    setCollectionImage(null);
    setIsTrending(false);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-[#f3ece6]">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Manage Collections
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[#fef5ee] border border-[#13524a] rounded-lg p-6 shadow-lg mb-8"
      >
        <h2 className="text-2xl font-moglan text-[#13524a] text-center mb-6">
          {editingCollection ? "Edit Collection" : "Add New Collection"}
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <div className="mb-4">
          <label
            htmlFor="collectionName"
            className="block text-gray-700 text-sm font-moglan mb-2"
          >
            Collection Name:
          </label>
          <input
            type="text"
            id="collectionName"
            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-[#13524a] focus:border-[#13524a] text-sm md:text-base"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="collectionImage"
            className="block text-gray-700 text-sm font-moglan mb-2"
          >
            Collection Image:
          </label>
          <input
            type="file"
            id="collectionImage"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            onChange={handleFileChange}
            accept="image/*"
            required={!editingCollection}
          />
          {editingCollection && editingCollection.imageUrl && (
            <p className="text-sm text-gray-600 mt-2">
              Current Image:{" "}
              <a
                href={`https://elianajewellery-backend.onrender.com${editingCollection.imageUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#13524a] hover:underline"
              >
                View Current Image
              </a>
              <br />
              (Upload new image to replace)
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="isTrending"
            className="flex items-center text-gray-700 text-sm font-moglan mb-2"
          >
            <input
              type="checkbox"
              id="isTrending"
              className="form-checkbox h-5 w-5 text-green-600 mr-2"
              checked={isTrending}
              onChange={(e) => setIsTrending(e.target.checked)}
            />
            Show in Trending Pieces on Homepage
          </label>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#13524a] hover:bg-[#18544d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#13524a] disabled:opacity-50"
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
              onClick={handleCancelEdit}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="bg-[#fef5ee] border border-[#13524a] p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-moglan text-[#13524a] text-center mb-6">
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
                    Trending
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
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {collection.isTrending ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {collection.imageUrl && (
                        <img
                          src={`https://elianajewellery-backend.onrender.com${collection.imageUrl}`}
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
