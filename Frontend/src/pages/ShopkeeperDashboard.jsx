import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // FETCH DASHBOARD
  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await API.get("/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDashboardData(data);

      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
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
      {/* HEADING */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Shopkeeper Dashboard
        </h1>

        <p className="text-gray-500 mt-2">Manage your digital udhaar system</p>
      </div>
      <button
        onClick={() => navigate("/transactions/create")}
        className="mt-5 px-6 py-3 bg-orange-500 text-white rounded-2xl font-semibold hover:bg-orange-600 transition"
      >
        + Create Transaction
      </button>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* TOTAL CUSTOMERS */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <p className="text-gray-500">Total Customers</p>

          <h2 className="text-4xl font-bold text-orange-500 mt-2">
            {dashboardData?.totalCustomers || 0}
          </h2>
        </div>

        {/* TOTAL UDHAR */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <p className="text-gray-500">Total Udhaar</p>

          <h2 className="text-4xl font-bold text-red-500 mt-2">
            ₹ {dashboardData?.totalUdhar || 0}
          </h2>
        </div>

        {/* TOTAL PROFIT */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <p className="text-gray-500">Total Profit</p>

          <h2 className="text-4xl font-bold text-green-500 mt-2">
            ₹ {dashboardData?.totalProfit || 0}
          </h2>
        </div>

        {/* OVERDUE */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <p className="text-gray-500">Overdue Customers</p>

          <h2 className="text-4xl font-bold text-yellow-500 mt-2">
            {dashboardData?.overdueCustomers || 0}
          </h2>
        </div>
      </div>

      {/* RECENT TRANSACTIONS */}
      <div className="mt-12 bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Recent Transactions
        </h2>

        <div className="space-y-4">
          {dashboardData?.recentTransactions?.map((transaction) => (
            <div
              key={transaction._id}
              className="flex items-center justify-between border-b pb-4"
            >
              <div>
                <h3 className="font-bold text-gray-800">
                  {transaction.customerId?.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {transaction.paymentType}
                </p>
              </div>

              <div className="text-right">
                <h3 className="font-bold text-orange-500">
                  ₹ {transaction.totalAmount}
                </h3>

                <p className="text-sm text-gray-500">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}

          {dashboardData?.recentTransactions?.length === 0 && (
            <p className="text-gray-500">No transactions yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
