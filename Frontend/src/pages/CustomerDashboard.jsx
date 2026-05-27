import { useEffect, useState } from "react";

import API from "../services/api";

export default function CustomerDashboard() {
  const [loading, setLoading] = useState(true);

  const [transactions, setTransactions] = useState([]);

  const [summary, setSummary] = useState({
    totalPending: 0,
    totalPaid: 0,
    totalFine: 0,
  });

  // FETCH CUSTOMER DATA
  const fetchCustomerData = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await API.get("/transactions/customer", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTransactions(data.transactions);

      setSummary({
        totalPending: data.totalPending,

        totalPaid: data.totalPaid,

        totalFine: data.totalFine,
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 p-8">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Customer Dashboard
        </h1>

        <p className="text-gray-500 mt-2">Track your udhaar and payments</p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PENDING */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <p className="text-gray-500">Pending Udhaar</p>

          <h2 className="text-4xl font-bold text-red-500 mt-2">
            ₹ {summary.totalPending}
          </h2>
        </div>

        {/* PAID */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <p className="text-gray-500">Total Paid</p>

          <h2 className="text-4xl font-bold text-green-500 mt-2">
            ₹ {summary.totalPaid}
          </h2>
        </div>

        {/* FINE */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <p className="text-gray-500">Total Fine</p>

          <h2 className="text-4xl font-bold text-yellow-500 mt-2">
            ₹ {summary.totalFine}
          </h2>
        </div>
      </div>

      {/* TRANSACTIONS */}
      <div className="mt-12 bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          My Transactions
        </h2>

        <div className="space-y-5">
          {transactions.map((transaction) => (
            <div
              key={transaction._id}
              className="border rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              {/* LEFT */}
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {transaction.shopkeeperId?.name}
                </h3>

                <p className="text-gray-500">{transaction.paymentType}</p>
              </div>

              {/* CENTER */}
              <div>
                <p className="text-sm text-gray-500">Amount</p>

                <h3 className="text-2xl font-bold text-orange-500">
                  ₹ {transaction.totalAmount}
                </h3>
              </div>

              {/* RIGHT */}
              <div className="text-right">
                <p className="text-sm text-gray-500">Due Date</p>

                <p className="font-semibold">
                  {transaction.dueDate
                    ? new Date(transaction.dueDate).toLocaleDateString()
                    : "N/A"}
                </p>

                {/* STATUS */}
                <span
                  className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-semibold ${
                    transaction.status === "completed"
                      ? "bg-green-100 text-green-600"
                      : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}

          {transactions.length === 0 && (
            <p className="text-gray-500">No transactions yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
