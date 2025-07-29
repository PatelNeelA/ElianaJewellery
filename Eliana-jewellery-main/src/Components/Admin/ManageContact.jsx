import React, { useState, useEffect } from "react";
import contactService from "../../Service/contactService";

const ManageContact = () => {
  const [contactMessages, setContactMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchContactMessages();
  }, []);

  const fetchContactMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactService.getAllMessages();
      setContactMessages(data);
    } catch (err) {
      setError("Failed to fetch contact messages.");
      console.error("Error fetching contact messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const result = await contactService.deleteMessage(id);
        setSuccess(result.message);
        fetchContactMessages();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete message.");
        console.error("Error deleting message:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-[#f3ece6]">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Manage Contact Messages
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      <div className="bg-[#fef5ee] border border-[#13524a] p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-moglan text-[#13524a] text-center mb-6">
          All Messages
        </h2>
        {loading && <p>Loading messages...</p>}
        {contactMessages.length === 0 && !loading && (
          <p>No contact messages found.</p>
        )}
        {contactMessages.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Full Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Phone Number
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Message
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Received At
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
                {contactMessages.map((msg) => (
                  <tr key={msg._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {msg.fullName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{msg.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {msg.phoneNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs overflow-hidden text-ellipsis">
                      {" "}
                      <div className="text-sm text-gray-900">{msg.message}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(msg.createdAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(msg._id)}
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

export default ManageContact;
