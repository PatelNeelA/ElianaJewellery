// components/Admin/ManageProduct.jsx (MODIFIED - "Select Collection" dropdown now shows ALL collections)
import React, { useState, useEffect } from "react";
import productService from "../../Service/productService";
import collectionService from "../../Service/collectionService";

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]); // Will hold ALL collections
  const [productName, setProductName] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const [price, setPrice] = useState("");
  const [gender, setGender] = useState("");
  const [occasion, setOccasion] = useState("");
  const [materialColor, setMaterialColor] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState("");

  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCollections(); // This will now fetch ALL collections
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      setError("Failed to fetch products.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollections = async () => {
    try {
      // MODIFIED: Fetch ALL collections, do not exclude trending ones
      const data = await collectionService.getCollections({}); // Pass an empty object to get all
      setCollections(data);
    } catch (err) {
      console.error("Error fetching collections for dropdown:", err);
    }
  };

  const handleFileChange = (e) => {
    setProductImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (
      !productName ||
      !productDetails ||
      !price ||
      !gender ||
      !occasion ||
      !materialColor ||
      !selectedCollection ||
      (!productImage && !editingProduct)
    ) {
      setError(
        "Please fill in all product fields and select an image (for new products)."
      );
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("productDetails", productDetails);
    formData.append("price", price);
    formData.append("gender", gender);
    formData.append("occasion", occasion);
    formData.append("materialColor", materialColor);
    formData.append("collection", selectedCollection);

    if (productImage) {
      formData.append("productImage", productImage);
    }

    try {
      if (editingProduct) {
        const result = await productService.updateProduct(
          editingProduct._id,
          formData
        );
        setSuccess(result.message);
      } else {
        const result = await productService.createProduct(formData);
        setSuccess(result.message);
      }
      setProductName("");
      setProductDetails("");
      setPrice("");
      setGender("");
      setOccasion("");
      setMaterialColor("");
      setProductImage(null);
      setSelectedCollection("");
      setEditingProduct(null);
      e.target.reset();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
      console.error("Error submitting product:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductName(product.name);
    setProductDetails(product.productDetails);
    setPrice(product.price);
    setGender(product.gender);
    setOccasion(product.occasion);
    setMaterialColor(product.materialColor);
    setProductImage(null);
    setSelectedCollection(product.collection?._id || "");
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const result = await productService.deleteProduct(id);
        setSuccess(result.message);
        fetchProducts();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete product.");
        console.error("Error deleting product:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setProductName("");
    setProductDetails("");
    setPrice("");
    setGender("");
    setOccasion("");
    setMaterialColor("");
    setProductImage(null);
    setSelectedCollection("");
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Manage Products
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-8"
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          {editingProduct ? "Edit Product" : "Add New Product"}
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label
              htmlFor="productName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Product Name:
            </label>
            <input
              type="text"
              id="productName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="collectionSelect"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Select Collection:
            </label>
            <select
              id="collectionSelect"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              required
            >
              <option value="">-- Select a Collection --</option>
              {collections.map((col) => (
                <option key={col._id} value={col._id}>
                  {col.name} {col.isTrending ? "(Trending)" : ""}{" "}
                  {/* Added "(Trending)" label */}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="productDetails"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Product Details:
            </label>
            <textarea
              id="productDetails"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24 resize-none"
              value={productDetails}
              onChange={(e) => setProductDetails(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Price (₹):
            </label>
            <input
              type="number"
              id="price"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="gender"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Gender:
            </label>
            <select
              id="gender"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">-- Select Gender --</option>
              <option value="Male">Men</option>
              <option value="Female">Women</option>
              <option value="Unisex">Unisex</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="occasion"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Occasion:
            </label>
            <input
              type="text"
              id="occasion"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="materialColor"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Material Color:
            </label>
            <input
              type="text"
              id="materialColor"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={materialColor}
              onChange={(e) => setMaterialColor(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="productImage"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Product Image:
            </label>
            <input
              type="file"
              id="productImage"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={handleFileChange}
              accept="image/*"
              required={!editingProduct} // Required only if not editing
            />
            {editingProduct && editingProduct.imageUrl && (
              <p className="text-sm text-gray-600 mt-2">
                Current Image:{" "}
                <a
                  href={`http://localhost:5000${editingProduct.imageUrl}`}
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
        </div>
        <div className="flex items-center justify-between mt-6">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : editingProduct
              ? "Update Product"
              : "Add Product"}
          </button>
          {editingProduct && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Existing Products
        </h2>
        {loading && <p>Loading products...</p>}
        {products.length === 0 && !loading && <p>No products found.</p>}
        {products.length > 0 && (
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
                    Collection
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
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
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.collection ? product.collection.name : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ₹{product.price}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.imageUrl && (
                        <img
                          src={`http://localhost:5000${product.imageUrl}`}
                          alt={product.name}
                          className="h-16 w-16 object-cover rounded-md"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
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

export default ManageProduct;
