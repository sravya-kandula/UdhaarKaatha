import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import API from "../services/api";

export default function CustomerShopPage() {
  const { shopkeeperId } = useParams();

  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);

  const [shop, setShop] = useState(null);

  const [loading, setLoading] = useState(true);

  // FETCH SHOP DATA
  const fetchShopData = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await API.get("/transactions/customer", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const filteredTransactions = data.transactions.filter(
        (transaction) => transaction.shopkeeperId?._id === shopkeeperId,
      );

      setTransactions(filteredTransactions);

      // SHOP INFO
      if (filteredTransactions.length > 0) {
        setShop({
          name: filteredTransactions[0]?.shopkeeperId?.name || "Shop",
        });
      }

      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopData();
  }, []);

  // TOTAL
  const totalPending = transactions.reduce(
    (acc, item) => acc + item.remainingAmount,
    0,
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8 rounded-b-[40px]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/customer/dashboard")}
            className="w-14 h-14 rounded-full bg-white text-2xl"
          >
            ←
          </button>

          <div>
            <h1 className="text-4xl font-black text-white">{shop?.name}</h1>

            <p className="text-purple-100 mt-2">Shop Transactions</p>
          </div>
        </div>

        {/* BALANCE */}
        <div className="bg-white rounded-[35px] mt-8 p-7">
          <p className="text-gray-500 text-lg">Total Pending Udhar</p>

          <h1 className="text-5xl font-black text-red-500 mt-3">
            ₹ {totalPending}
          </h1>

          {/* ACTIONS */}
          <div className="grid grid-cols-2 gap-5 mt-8">
            <button className="bg-green-500 text-white py-4 rounded-2xl text-lg font-bold">
              Pay Now
            </button>

            <button className="bg-purple-600 text-white py-4 rounded-2xl text-lg font-bold">
              Buy Items
            </button>
          </div>
        </div>
      </div>

      {/* TRANSACTIONS */}
      <div className="px-6 py-10">
        <h1 className="text-4xl font-black text-gray-800 mb-8">
          Recent Transactions
        </h1>

        <div className="space-y-5">
          {transactions.map((transaction) => (
            <div
              key={transaction._id}
              className="bg-white rounded-[30px] p-6 shadow-md"
            >
              <div className="flex items-center justify-between">
                {/* LEFT */}
                <div className="flex items-center gap-5">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${
                      transaction.transactionType === "payment"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    {transaction.transactionType === "payment" ? "💰" : "🧾"}
                  </div>

                  <div>
                    <h1 className="text-2xl font-black text-gray-800">
                      {transaction.transactionType === "payment"
                        ? "Payment Done"
                        : "Udhar Added"}
                    </h1>

                    {/* ITEMS */}
                    {transaction.items?.map((item, index) => (
                      <p key={index} className="text-gray-500 mt-1">
                        {item.itemName} × {item.quantity}
                      </p>
                    ))}

                    <p className="text-gray-400 text-sm mt-2">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="text-right">
                  <h1
                    className={`text-4xl font-black ${
                      transaction.transactionType === "payment"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {transaction.transactionType === "payment" ? "+" : "-"}₹{" "}
                    {transaction.transactionType === "payment"
                      ? transaction.paidAmount
                      : transaction.remainingAmount}
                  </h1>

                  <div
                    className={`inline-block mt-3 px-4 py-2 rounded-full text-sm font-bold ${
                      transaction.transactionType === "payment"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {transaction.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
