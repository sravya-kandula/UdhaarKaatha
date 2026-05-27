import { useNavigate } from "react-router-dom";

import shopImage from "../assets/Meals.png";
import shopingImage from "../assets/MainPage.png";

export default function HomePage() {
  const navigate = useNavigate();

  const shops = [
    {
      name: "Sri Lakshmi Kirana Store",
      image:
        "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Annapurna Hotel",
      image: shopImage,
    },
    {
      name: "Apollo Medical Store",
      image:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Fresh Basket Store",
      image:
        "https://images.unsplash.com/photo-1579113800032-c38bd7635818?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            ₹
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">Udhaar Khata</h1>

            <p className="text-sm text-gray-500">
              Digital Ledger for Kirana Stores
            </p>
          </div>
        </div>

        {/* LOGIN BUTTON */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 rounded-xl border border-orange-400 text-orange-500 font-medium hover:bg-orange-50 transition"
          >
            Login
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="text-center px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-800 leading-tight">
            Replace Your Traditional
            <span className="text-orange-500"> Udhaar Book </span>
            With Digital Khata
          </h2>

          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            Track customer credits, manage payments, send WhatsApp reminders,
            and generate monthly statements — all in one place.
          </p>

          {/* BUTTONS */}
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            {/* REGISTER */}
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-3 rounded-2xl bg-orange-500 text-white text-lg font-semibold shadow-lg hover:scale-105 transition"
            >
              Get Started
            </button>

            {/* LEARN MORE */}
            <button className="px-8 py-3 rounded-2xl border border-gray-300 text-gray-700 text-lg font-semibold hover:bg-gray-100 transition">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* BUY NOW / PAY LATER */}
      <section className="px-8 py-16">
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            {/* LEFT CONTENT */}
            <div className="p-10">
              <span className="bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-semibold">
                Smart Khata Feature
              </span>

              <h2 className="mt-5 text-4xl font-extrabold text-gray-800 leading-tight">
                Buy Now,
                <span className="text-orange-500"> Pay Later </span>
              </h2>

              <p className="mt-5 text-gray-600 text-lg leading-relaxed">
                Customers can instantly purchase products and choose whether to
                pay immediately or add the amount to their digital khata.
                Shopkeepers can easily track pending balances and payment
                history.
              </p>

              {/* FEATURES */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    ✅
                  </div>

                  <p className="text-gray-700 font-medium">
                    Instant Digital Credit Tracking
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    ✅
                  </div>

                  <p className="text-gray-700 font-medium">
                    Real-time Pending Balance Updates
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    ✅
                  </div>

                  <p className="text-gray-700 font-medium">
                    Easy Monthly Payment Management
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-10 flex gap-4 flex-wrap">
                {/* BUY & PAY */}
                <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-3 rounded-2xl bg-green-500 text-white font-semibold shadow hover:scale-105 transition"
                >
                  Buy & Pay Now
                </button>

                {/* BUY & ADD TO KHATA */}
                <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-3 rounded-2xl bg-orange-500 text-white font-semibold shadow hover:scale-105 transition"
                >
                  Buy & Add to Khata
                </button>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="h-full">
              <img
                src={shopingImage}
                alt="Mall Shopping"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* STORES */}
      <section className="px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h3 className="text-3xl font-bold text-gray-800">
              Popular Kirana Stores
            </h3>

            <p className="text-gray-500 mt-2">
              Click on any store to explore its digital ledger system.
            </p>

            {/* VIEW ALL STORES */}
            <button
              onClick={() => navigate("/stores")}
              className="mt-4 px-6 py-2 rounded-xl bg-orange-400 text-white font-medium hover:bg-green-500 transition"
            >
              View All Stores
            </button>
          </div>

          {/* STORE CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {shops.map((shop, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 cursor-pointer hover:-translate-y-2"
              >
                {/* IMAGE */}
                <div className="overflow-hidden h-56">
                  <img
                    src={shop.image}
                    alt={shop.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-5">
                  <h4 className="text-xl font-bold text-gray-800">
                    {shop.name}
                  </h4>

                  <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                    Manage customer udhaar, payments, and reminders digitally.
                  </p>

                  {/* OPEN STORE */}
                  <button
                    onClick={() => navigate("/login")}
                    className="mt-5 w-full py-2 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition"
                  >
                    Open Store
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t py-6 text-center text-gray-500 text-sm">
        © 2026 Udhaar Khata • Smart Digital Ledger for Local Shops
      </footer>
    </div>
  );
}
