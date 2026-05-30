import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

import shopingImage from "../assets/RegBack.png";

export default function Login() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
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

  // HANDLE LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/auth/login", formData);

      // SAVE TOKEN
      localStorage.setItem("token", data.token);

      // SAVE USER
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Login successful");

      // ROLE BASED REDIRECT
      setTimeout(() => {
        if (data.user.role === "shopkeeper") {
          navigate("/shopkeeper/dashboard");
        } else {
          navigate("/customer/dashboard");
        }
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f6f7fb]">
      {/* LEFT IMAGE */}
      <div className="hidden lg:block lg:w-1/2 bg-black">
        <img
          src={shopingImage}
          alt="Shopping Background"
          className="w-full h-screen object-cover object-center"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10">
        <div className="bg-white p-10 rounded-[35px] shadow-2xl w-full max-w-md border border-gray-100">
          {/* ICON */}
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 rounded-3xl bg-purple-100 flex items-center justify-center text-4xl shadow-lg">
              🔐
            </div>
          </div>

          {/* HEADING */}
          <h2 className="text-4xl font-black text-center text-gray-800">
            Welcome Back
          </h2>

          <p className="text-center text-gray-500 mt-3">
            Login to continue managing your digital khata
          </p>

          {/* MESSAGE */}
          {message && (
            <div
              className={`mt-5 text-center py-3 rounded-2xl font-bold ${
                message.toLowerCase().includes("success")
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-500"
              }`}
            >
              {message}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="w-full mt-2 border border-gray-300 p-4 rounded-2xl outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition"
              />
            </div>

            {/* ROLE */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Login As
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
              Login
            </button>
          </form>

          {/* REGISTER */}
          <p className="text-center mt-6 text-gray-500">
            Don&apos;t have an account?
            <button
              onClick={() => navigate("/register")}
              className="text-purple-600 ml-2 font-bold hover:underline"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
