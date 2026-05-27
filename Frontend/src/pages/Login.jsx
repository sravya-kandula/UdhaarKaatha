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
  });

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

      setMessage("Login successful");

      // REDIRECT
      // SAVE TOKEN
      localStorage.setItem("token", data.token);

      // SAVE USER
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Login successful");

      // ROLE BASED REDIRECT
      if (data.user.role === "shopkeeper") {
        navigate("/shopkeeper/dashboard");
      } else if (data.user.role === "customer") {
        navigate("/customer/dashboard");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT IMAGE */}
      <div className="hidden lg:block lg:w-1/2 bg-black">
        <img
          src={shopingImage}
          alt="Shopping Background"
          className="w-full h-screen object-cover object-center"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-yellow-50 px-6 py-10">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
          {/* HEADING */}
          <h2 className="text-4xl font-bold text-center text-gray-800">
            Welcome Back
          </h2>

          <p className="text-center text-gray-500 mt-3 leading-relaxed">
            Login to continue managing your digital khata
          </p>

          {/* MESSAGE */}
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

          {/* FORM */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:bg-orange-600 hover:scale-[1.02] transition"
            >
              Login
            </button>
          </form>

          {/* TOGGLE */}
          <p className="text-center mt-6 text-gray-500">
            Don&apos;t have an account?
            <button
              onClick={() => navigate("/register")}
              className="text-orange-500 ml-2 font-semibold hover:underline"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
