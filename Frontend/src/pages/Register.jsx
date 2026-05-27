import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

import shopingImage from "../assets/RegBack.png";

export default function Register() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

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

      setMessage("Registration successful");

      console.log(data);

      // REDIRECT TO LOGIN
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT IMAGE */}
      <div className="hidden lg:block lg:w-1/2 bg-black">
        <img
          src={shopingImage}
          alt="Register Background"
          className="w-full h-screen object-cover object-center"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-yellow-50 px-6 py-10">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
          {/* HEADING */}
          <h2 className="text-4xl font-bold text-center text-gray-800">
            Create Account
          </h2>

          <p className="text-center text-gray-500 mt-3 leading-relaxed">
            Register to start your digital udhaar journey
          </p>

          {/* MESSAGE */}
          {message && (
            <div
              className={`mt-4 flex items-center justify-center gap-2 text-sm font-medium ${
                message.toLowerCase().includes("successful")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              <span className="text-lg">
                {message.toLowerCase().includes("successful") ? "✅" : "❌"}
              </span>

              <p>{message}</p>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* NAME */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-4 rounded-2xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
            />

            {/* EMAIL */}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-4 rounded-2xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
            />

            {/* PASSWORD */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-4 rounded-2xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
            />

            {/* ROLE */}
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 p-4 rounded-2xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
            >
              <option value="customer">Customer</option>

              <option value="shopkeeper">Shopkeeper</option>
            </select>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:bg-orange-600 hover:scale-[1.02] transition"
            >
              Register
            </button>
          </form>

          {/* LOGIN LINK */}
          <p className="text-center mt-6 text-gray-500">
            Already have an account?
            <button
              onClick={() => navigate("/login")}
              className="text-orange-500 ml-2 font-semibold hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
