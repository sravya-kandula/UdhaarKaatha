import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

export default function CustomerShopPage() {
  const { shopkeeperId } = useParams();

  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchShopData = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await API.get("/transactions/customer", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("SHOP PARAM:", shopkeeperId);
      console.log("ALL TRANSACTIONS:", data.transactions);

      const filteredTransactions = data.transactions.filter((transaction) => {
        const transactionShopkeeperId =
          transaction.shopkeeperId?._id || transaction.shopkeeperId || "";

        return transactionShopkeeperId.toString() === shopkeeperId.toString();
      });

      console.log("FILTERED TRANSACTIONS:", filteredTransactions);

      setTransactions(filteredTransactions);

      if (filteredTransactions.length > 0) {
        const firstTransaction = filteredTransactions[0];

        setShop({
          id:
            firstTransaction.shopkeeperId?._id || firstTransaction.shopkeeperId,
          name:
            firstTransaction.shopkeeperId?.shopName ||
            firstTransaction.shopkeeperId?.name ||
            "Shop",
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
  }, [shopkeeperId]);

  const totalPending = transactions.reduce(
    (acc, item) => acc + Number(item.remainingAmount || 0),
    0,
  );

  const totalPaid = transactions.reduce(
    (acc, item) => acc + Number(item.paidAmount || 0),
    0,
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] pb-10">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8 rounded-b-[40px]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/customer/dashboard")}
            className="w-14 h-14 rounded-full bg-white text-2xl shadow"
          >
            ←
          </button>

          <div>
            <h1 className="text-4xl font-black text-white">
              {shop?.name || "Shop"}
            </h1>

            <p className="text-purple-100 mt-2">Your Udhar & Payment History</p>
          </div>
        </div>

        {/* SUMMARY CARD */}
        <div className="bg-white rounded-[35px] mt-8 p-7 shadow-xl">
          <p className="text-gray-500 text-lg">Pending Balance</p>

          <h1 className="text-5xl font-black text-red-500 mt-3">
            ₹ {totalPending}
          </h1>

          <div className="grid grid-cols-2 gap-5 mt-8">
            <div className="bg-green-50 rounded-3xl p-5">
              <p className="text-gray-500 text-sm">Total Paid</p>

              <h2 className="text-3xl font-black text-green-500 mt-2">
                ₹ {totalPaid}
              </h2>
            </div>

            <div className="bg-red-50 rounded-3xl p-5">
              <p className="text-gray-500 text-sm">Transactions</p>

              <h2 className="text-3xl font-black text-red-500 mt-2">
                {transactions.length}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 mt-8">
            <button className="bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl text-lg font-bold transition">
              Pay Now
            </button>

            <button className="bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-2xl text-lg font-bold transition">
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

        {transactions.length === 0 ? (
          <div className="bg-white rounded-[30px] p-10 shadow-md text-center">
            <div className="text-6xl mb-4">📒</div>

            <h2 className="text-2xl font-black text-gray-700">
              No Transactions Found
            </h2>

            <p className="text-gray-500 mt-3">
              No udhar records available for this shop.
            </p>

            <p className="text-xs text-gray-400 mt-4">
              Shop ID: {shopkeeperId}
            </p>
          </div>
        ) : (
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
                          ? "Payment Received"
                          : "Udhar Added"}
                      </h1>

                      {transaction.items?.length > 0 &&
                        transaction.items.map((item, index) => (
                          <p key={index} className="text-gray-500 mt-1 text-sm">
                            {item.itemName} × {item.quantity}
                          </p>
                        ))}

                      <p className="text-gray-400 text-sm mt-2">
                        {new Date(transaction.createdAt).toLocaleDateString()}
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
                      {transaction.transactionType === "payment" ? "+" : "-"}₹
                      {transaction.transactionType === "payment"
                        ? transaction.paidAmount
                        : transaction.remainingAmount}
                    </h1>

                    <div
                      className={`inline-block mt-3 px-4 py-2 rounded-full text-sm font-bold ${
                        transaction.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : transaction.status === "partial"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-red-100 text-red-600"
                      }`}
                    >
                      {transaction.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
