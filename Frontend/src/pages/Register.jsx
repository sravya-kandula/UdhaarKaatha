import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

import shopingImage from "../assets/RegBack.png";

export default function Register() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    role: "customer",
    shopName: "",
  });

  // FIXED SHOPS
  const shops = [
    "Sri Lakshmi Kirana Store",
    "Annapurna Hotel",
    "Apollo Medical Store",
    "Fresh Basket Store",
    "Royal Bakery",
  ];

  // HANDLE INPUTS
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // HANDLE REGISTER
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/auth/register", formData);

      setMessage("Registration successful ✅");

      console.log(data);

      // REDIRECT
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f6f7fb]">
      {/* LEFT IMAGE */}
      <div className="hidden lg:block lg:w-1/2 bg-black">
        <img
          src={shopingImage}
          alt="Register Background"
          className="w-full h-screen object-cover object-center"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10">
        <div className="bg-white p-10 rounded-[35px] shadow-2xl w-full max-w-md border border-gray-100">
          {/* LOGO */}
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 rounded-3xl bg-purple-100 flex items-center justify-center text-4xl shadow-lg">
              🏪
            </div>
          </div>

          {/* HEADING */}
          <h2 className="text-4xl font-black text-center text-gray-800">
            Create Account
          </h2>

          <p className="text-center text-gray-500 mt-3 leading-relaxed">
            Register to start your digital udhaar journey
          </p>

          {/* MESSAGE */}
          {message && (
            <div
              className={`mt-5 text-center text-sm font-bold rounded-2xl py-3 ${
                message.toLowerCase().includes("successful")
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-500"
              }`}
            >
              {message}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* NAME */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-2 border border-gray-300 p-4 rounded-2xl outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 p-4 rounded-2xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-2 border border-gray-300 p-4 rounded-2xl outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                className="w-full mt-2 border border-gray-300 p-4 rounded-2xl outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition"
              />
            </div>

            {/* ROLE */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Select Role
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full mt-2 border border-gray-300 p-4 rounded-2xl outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition"
              >
                <option value="customer">Customer</option>

                <option value="shopkeeper">Shopkeeper</option>
              </select>
            </div>

            {/* SHOP DROPDOWN */}
            {formData.role === "shopkeeper" && (
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Select Shop
                </label>

                <select
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  className="w-full mt-2 border border-gray-300 p-4 rounded-2xl outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition"
                >
                  <option value="">Choose Shop</option>

                  {shops.map((shop, index) => (
                    <option key={index} value={shop}>
                      {shop}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#5f259f] to-[#7b39c6] text-white py-4 rounded-2xl font-bold shadow-xl hover:scale-[1.02] transition duration-300"
            >
              Register
            </button>
          </form>

          {/* LOGIN LINK */}
          <p className="text-center mt-7 text-gray-500">
            Already have an account?
            <button
              onClick={() => navigate("/login")}
              className="text-purple-600 ml-2 font-bold hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
