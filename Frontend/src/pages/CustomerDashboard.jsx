import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function CustomerDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [shops, setShops] = useState([]);

  const [summary, setSummary] = useState({
    totalPending: 0,
    totalPaid: 0,
    totalFine: 0,
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const [customer, setCustomer] = useState({
    name: user?.name || "Customer",
  });
  // FEATURED STATIC SHOPS
  const featuredShops = [
    {
      id: 1,
      name: "Sri Lakshmi Kirana Store",
      logo: "🛒",
      subtitle: "Grocery & daily essentials",
      color: "bg-pink-100",
    },

    {
      id: 2,
      name: "Annapurna Hotel",
      logo: "🍛",
      subtitle: "Food & meals",
      color: "bg-orange-100",
    },

    {
      id: 3,
      name: "Apollo Medical Store",
      logo: "💊",
      subtitle: "Medicines & healthcare",
      color: "bg-green-100",
    },

    {
      id: 4,
      name: "Fresh Basket Store",
      logo: "🥬",
      subtitle: "Fresh vegetables & fruits",
      color: "bg-yellow-100",
    },

    {
      id: 5,
      name: "Royal Bakery",
      logo: "🥐",
      subtitle: "Cakes & bakery items",
      color: "bg-purple-100",
    },
  ];

  // FETCH CUSTOMER DATA
  const fetchCustomerData = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await API.get("/transactions/customer", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("API RESPONSE =", data);

      setShops(data.shops || []);

      setSummary({
        totalPending: data.totalPending || 0,
        totalPaid: data.totalPaid || 0,
        totalFine: data.totalFine || 0,
      });

      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] pb-24">
      {/* TOP HEADER */}
      <div className="bg-gradient-to-b from-[#5f259f] to-[#7b39c6] rounded-b-[45px] px-5 pt-7 pb-10 shadow-xl">
        {/* PROFILE */}
        <div className="flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            {/* PROFILE */}
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl shadow-xl">
              👤
            </div>

            {/* NAME */}
            <div>
              <h1 className="text-3xl font-black text-white">
                Hi, {customer.name} 👋
              </h1>

              <p className="text-purple-100 mt-1">Manage your udhaar smartly</p>
            </div>
          </div>

          {/* NOTIFICATION */}
          <button className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-lg text-white text-2xl">
            🔔
          </button>
        </div>

        {/* WALLET CARD */}
        <div className="bg-white rounded-[35px] mt-8 p-7 shadow-2xl">
          <p className="text-gray-500 text-lg">Total Udhar Balance</p>

          <h1 className="text-5xl font-black text-red-500 mt-3">
            ₹ {summary.totalPending}
          </h1>

          {/* MINI CARDS */}
          <div className="grid grid-cols-2 gap-5 mt-8">
            {/* PAID */}
            <div className="bg-green-50 rounded-3xl p-5">
              <p className="text-gray-500 text-sm">Total Paid</p>

              <h2 className="text-3xl font-black text-green-500 mt-2">
                ₹ {summary.totalPaid}
              </h2>
            </div>

            {/* FINE */}
            <div className="bg-yellow-50 rounded-3xl p-5">
              <p className="text-gray-500 text-sm">Fine Amount</p>

              <h2 className="text-3xl font-black text-yellow-500 mt-2">
                ₹ {summary.totalFine}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK SHOP ICONS */}
      <div className="px-5 mt-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-black text-gray-800">Popular Shops</h1>

            <p className="text-gray-500 text-sm mt-1">Buy now & pay later</p>
          </div>
        </div>

        {/* HORIZONTAL SHOPS */}
        <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide">
          {featuredShops.map((shop) => (
            <div
              key={shop.id}
              className="min-w-[95px] flex flex-col items-center"
            >
              {/* ICON */}
              <button
                onClick={() => navigate(`/customer/shop/${shop.id}`)}
                className={`w-20 h-20 rounded-3xl ${shop.color} flex items-center justify-center text-4xl shadow-sm`}
              >
                {shop.logo}
              </button>

              {/* NAME */}
              <p className="text-center text-sm font-semibold text-gray-700 mt-3">
                {shop.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURED SHOPS */}
      <div className="px-5 mt-10">
        {/* TITLE */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-800">
              Featured Shops
            </h1>

            <p className="text-gray-500 mt-1">Manage your payments & udhaar</p>
          </div>
        </div>

        {/* SHOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredShops.map((shop) => (
            <div
              key={shop.id}
              className="bg-white rounded-[35px] p-6 shadow-md border border-gray-100"
            >
              {/* TOP */}
              <div className="flex items-center justify-between">
                {/* LEFT */}
                <div className="flex items-center gap-4">
                  {/* LOGO */}
                  <div
                    className={`w-16 h-16 rounded-3xl ${shop.color} flex items-center justify-center text-4xl`}
                  >
                    {shop.logo}
                  </div>

                  {/* DETAILS */}
                  <div>
                    <h1 className="text-xl font-black text-gray-800">
                      {shop.name}
                    </h1>

                    <p className="text-gray-500 text-sm mt-1">
                      {shop.subtitle}
                    </p>
                  </div>
                </div>

                {/* STATUS */}
                <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-bold">
                  Active
                </div>
              </div>

              {/* BUTTONS */}
              <div className="grid grid-cols-2 gap-4 mt-7">
                {/* OPEN */}
                <button
                  onClick={() => navigate(`/customer/shop/${shop.id}`)}
                  className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-2xl font-bold transition"
                >
                  Open Store
                </button>

                {/* PAY */}
                <button className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl font-bold transition">
                  Pay Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CUSTOMER SHOPS */}
      {shops.length > 0 && (
        <div className="px-5 mt-12">
          {/* TITLE */}
          <div className="mb-6">
            <h1 className="text-3xl font-black text-gray-800">
              Your Udhar Shops
            </h1>

            <p className="text-gray-500 mt-1">
              Shops where you have pending balance
            </p>
          </div>

          {/* SHOP LIST */}
          <div className="space-y-5">
            {shops.map((shop) => (
              <div
                key={shop.shopkeeperId}
                className="bg-white rounded-[35px] p-6 shadow-md border border-gray-100"
              >
                {/* TOP */}
                <div className="flex items-center justify-between">
                  {/* LEFT */}
                  <div className="flex items-center gap-4">
                    {/* LOGO */}
                    <div className="w-16 h-16 rounded-3xl bg-purple-100 flex items-center justify-center text-4xl">
                      🏪
                    </div>

                    {/* DETAILS */}
                    <div>
                      <h1 className="text-2xl font-black text-gray-800">
                        {shop.shopName}
                      </h1>

                      <p className="text-gray-500 mt-1">
                        {shop.totalTransactions} transactions
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="text-right">
                    <p className="text-gray-500 text-sm">Pending</p>

                    <h1 className="text-3xl font-black text-red-500 mt-1">
                      ₹ {shop.totalPending}
                    </h1>
                  </div>
                </div>

                {/* BUTTON */}
                <button
                  onClick={() =>
                    navigate(`/customer/shop/${shop.shopkeeperId}`)
                  }
                  className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-2xl text-lg font-bold transition"
                >
                  Open Shop
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
