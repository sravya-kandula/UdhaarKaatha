import { useEffect, useState } from "react";
import API from "../services/api";

export default function CustomerDashboard() {
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

  const handlePayNow = async (amount, shop) => {
    try {
      // 1. Create order from backend
      const { data } = await API.post("/payment/create-order", {
        amount,
      });

      const order = data.order;

      if (!order) {
        throw new Error("Order creation failed");
      }

      console.log("ORDER CREATED:", order);

      // 2. Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Udhaar Katha",
        description: `Payment for ${shop.shopName}`,
        order_id: order.id,

        // ⚠️ IMPORTANT: handler
        handler: async function (response) {
          try {
            console.log("RAZORPAY RESPONSE:", response);

            const user = JSON.parse(localStorage.getItem("user"));
            console.log("USER =", user);
            console.log("CUSTOMER ID =", user.customerId);

            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,

              amount: amount, // use actual amount, not shop.totalPending

              customerId: user?.customerId,
              shopkeeperId: shop.shopkeeperId,
            };

            console.log("VERIFY PAYLOAD:", verifyPayload);

            const verifyRes = await API.post(
              "/payment/verify-payment",
              verifyPayload,
            );

            console.log("VERIFY RESPONSE:", verifyRes.data);

            alert("Payment successful!");

            // refresh dashboard immediately
            fetchCustomerData();
          } catch (error) {
            console.log(
              "Verification Error:",
              error?.response?.data || error.message,
            );
            alert("Payment verification failed");
          }
        },

        // 3. Handle failure case (IMPORTANT ADDITION)
        modal: {
          ondismiss: function () {
            console.log("Payment popup closed by user");
          },
        },

        theme: {
          color: "#7b39c6",
        },
      };

      // 4. Open Razorpay
      const razor = new window.Razorpay(options);

      // 5. Handle payment failure event
      razor.on("payment.failed", function (response) {
        console.log("PAYMENT FAILED:", response.error);
        alert("Payment failed. Try again.");
      });

      razor.open();
    } catch (err) {
      console.log("Create Order Error:", err?.response?.data || err.message);
      alert("Unable to initiate payment");
    }
  };
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
      {/* CUSTOMER SHOPS */}
      {shops.length > 0 && (
        <div className="px-5 mt-12">
          <div className="mb-6">
            <h1 className="text-3xl font-black text-gray-800">
              Your Udhar Shops
            </h1>

            <p className="text-gray-500 mt-1">
              Shops where you have pending balance
            </p>
          </div>

          <div className="space-y-5">
            {shops.map((shop) => (
              <div
                key={shop.shopkeeperId}
                className="bg-white rounded-[35px] p-6 shadow-md border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-3xl bg-purple-100 flex items-center justify-center text-4xl">
                      🏪
                    </div>

                    <div>
                      <h1 className="text-2xl font-black text-gray-800">
                        {shop.shopName}
                      </h1>

                      <p className="text-gray-500 mt-1">
                        {shop.totalTransactions} transactions
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-500 text-sm">Pending Amount</p>

                    <h1 className="text-3xl font-black text-red-500 mt-1">
                      ₹ {shop.totalPending}
                    </h1>
                  </div>
                </div>

                <button
                  onClick={() => handlePayNow(shop.totalPending, shop)}
                  className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl text-lg font-bold transition"
                >
                  Pay Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AVAILABLE SHOPS */}
      <div className="px-5 mt-10">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-gray-800">Available Shops</h1>

          <p className="text-gray-500 mt-1">Shops available on Udhaar Katha</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {featuredShops.map((shop) => (
            <div
              key={shop.id}
              className="bg-white rounded-[30px] p-5 shadow-md border border-gray-100"
            >
              <div
                className={`w-16 h-16 ${shop.color} rounded-3xl flex items-center justify-center text-4xl mx-auto`}
              >
                {shop.logo}
              </div>

              <h2 className="text-center font-black text-gray-800 mt-4">
                {shop.name}
              </h2>

              <p className="text-center text-gray-500 text-sm mt-1">
                {shop.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
