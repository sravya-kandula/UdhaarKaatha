import { useState } from "react";
import axios from "axios";
import shopingImage from "../assets/RegBack.png";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const [message, setMessage] = useState("");

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Register/Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isLogin
        ? "http://localhost:4000/api/auth/login"
        : "http://localhost:4000/api/auth/register";

      const response = await axios.post(url, formData);

      setMessage(response.data.message);

      console.log(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side Image */}
      <div className="hidden lg:block lg:w-1/2 bg-black">
        <img
          src={shopingImage}
          alt="Shopping Background"
          className="w-full h-screen object-cover object-center"
        />
      </div>

      {/* Right Side Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-yellow-50 px-6 py-10">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
          {/* Heading */}
          <h2 className="text-4xl font-bold text-center text-gray-800">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>

          <p className="text-center text-gray-500 mt-3 leading-relaxed">
            {isLogin
              ? "Login to continue managing your digital khata"
              : "Register to start your digital udhaar journey"}
          </p>

          {/* Message */}
          {message && (
            <div
              className={`mt-4 flex items-center justify-center gap-2 text-sm font-medium ${
                message.toLowerCase().includes("success")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              <span className="text-lg">
                {message.toLowerCase().includes("success") ? "✅" : "❌"}
              </span>

              <p>{message}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Name */}
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 p-4 rounded-2xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
              />
            )}

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-4 rounded-2xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-4 rounded-2xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
            />

            {/* Role Selection */}
            {!isLogin && (
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-gray-300 p-4 rounded-2xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
              >
                <option value="customer">Customer</option>
                <option value="shopkeeper">Shopkeeper</option>
              </select>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:bg-orange-600 hover:scale-[1.02] transition"
            >
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center mt-6 text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}

            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage("");
              }}
              className="text-orange-500 ml-2 font-semibold hover:underline"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
