import React, { useState } from "react";
import arrow from "/assets/images/follow-arrow.png";
import instagram1 from "/assets/images/instagram1.png";
import instagram2 from "/assets/images/instagram2.png";
import instagram3 from "/assets/images/instagram3.png";
import instagram4 from "/assets/images/instagram4.png";
import instagram5 from "/assets/images/instagram5.png";
import contactService from "../../Service/contactService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Full Name is required.";
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid.";
    }
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone Number is required.";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "Phone number must be 10 digits.";
    }
    if (!formData.message.trim()) errors.message = "Message is required.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please correct the form errors.", { position: "top-right" });
      return;
    }

    setLoading(true);
    try {
      const response = await contactService.submitMessage(formData);
      toast.success(response.message, { position: "top-right" });
      setFormData({ fullName: "", email: "", phoneNumber: "", message: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message.", {
        position: "top-right",
      });
      console.error("Error submitting contact form:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        id="contact"
        className="w-full flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-8 sm:py-10 md:py-12"
      >
        {/* Contact Form */}
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-[#fef5ee] border border-[#13524a] rounded-lg p-4 sm:p-6 shadow-lg">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-moglan text-[#13524a] text-center mb-4 sm:mb-6">
            Get In Touch
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs sm:text-sm md:text-base font-moglan text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`mt-1 block w-full p-2 text-sm sm:text-base border rounded-md shadow-sm focus:ring-[#13524a] focus:border-[#13524a] ${
                  formErrors.fullName ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {formErrors.fullName && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {formErrors.fullName}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm md:text-base font-moglan text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full p-2 text-sm sm:text-base border rounded-md shadow-sm focus:ring-[#13524a] focus:border-[#13524a] ${
                  formErrors.email ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {formErrors.email && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {formErrors.email}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-xs sm:text-sm md:text-base font-moglan text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`mt-1 block w-full p-2 text-sm sm:text-base border rounded-md shadow-sm focus:ring-[#13524a] focus:border-[#13524a] ${
                  formErrors.phoneNumber ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {formErrors.phoneNumber && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {formErrors.phoneNumber}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-xs sm:text-sm md:text-base font-moglan text-gray-700"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="3"
                value={formData.message}
                onChange={handleChange}
                className={`mt-1 block w-full p-2 text-sm sm:text-base border rounded-md shadow-sm focus:ring-[#13524a] focus:border-[#13524a] resize-y ${
                  formErrors.message ? "border-red-500" : "border-gray-300"
                }`}
                required
              ></textarea>
              {formErrors.message && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {formErrors.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-xs sm:text-sm md:text-base font-medium text-white bg-[#13524a] hover:bg-[#18544d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#13524a] disabled:opacity-50 transition-colors duration-200"
              disabled={loading}
            >
              {loading ? "Sending..." : "Submit"}
            </button>
          </form>
        </div>

        {/* Instagram Gallery - Added responsive grid */}
      </div>
      {/* <ToastContainer /> */}
    </>
  );
};

export default Contact;
