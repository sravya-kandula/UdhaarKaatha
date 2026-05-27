import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import API from "../services/api";

export default function CustomerLedger() {
  const { customerId } = useParams();

  const [customer, setCustomer] = useState(null);

  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [paymentAmount, setPaymentAmount] = useState("");

  // FETCH LEDGER
  const fetchLedger = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await API.get(`/transactions/ledger/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCustomer(data.customer);

      setTransactions(data.transactions);

      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);
    }
  };

  // RECORD PAYMENT
  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/transactions/payment",
        {
          customerId,
          amount: paymentAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Payment recorded successfully");

      setPaymentAmount("");

      // REFRESH LEDGER
      fetchLedger();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Payment failed");
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading Ledger...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 p-8">
      {/* HEADER */}
      <div className="bg-white rounded-3xl shadow-lg p-8 mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800">
          {customer?.name}
        </h1>

        <p className="text-gray-500 mt-2">{customer?.phone}</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* BALANCE */}
          <div className="bg-orange-100 p-6 rounded-2xl">
            <p className="text-gray-600">Current Balance</p>

            <h2 className="text-3xl font-bold text-red-500 mt-2">
              ₹ {customer?.currentBalance}
            </h2>
          </div>

          {/* LIMIT */}
          <div className="bg-green-100 p-6 rounded-2xl">
            <p className="text-gray-600">Udhaar Limit</p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              ₹ {customer?.udharLimit}
            </h2>
          </div>

          {/* STATUS */}
          <div className="bg-yellow-100 p-6 rounded-2xl">
            <p className="text-gray-600">Status</p>

            <h2 className="text-3xl font-bold text-yellow-600 mt-2 capitalize">
              {customer?.status}
            </h2>
          </div>
        </div>
      </div>

      {/* RECORD PAYMENT */}
      <div className="bg-white rounded-3xl shadow-lg p-8 mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Record Payment
        </h2>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="number"
            placeholder="Enter payment amount"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            className="flex-1 border border-gray-300 p-4 rounded-2xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />

          <button
            onClick={handlePayment}
            className="bg-green-500 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-green-600 transition"
          >
            Record Payment
          </button>
        </div>
      </div>

      {/* TRANSACTIONS */}
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Transaction History
        </h2>

        <div className="space-y-6">
          {transactions.map((transaction) => (
            <div key={transaction._id} className="border rounded-2xl p-6">
              {/* TOP */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {transaction.transactionType === "payment"
                      ? "Payment Received"
                      : "Purchase Transaction"}
                  </h3>

                  <p className="text-gray-500 mt-1">
                    {new Date(transaction.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <h2 className="text-3xl font-bold text-orange-500">
                    ₹ {transaction.totalAmount}
                  </h2>

                  <span
                    className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-semibold ${
                      transaction.status === "completed"
                        ? "bg-green-100 text-green-600"
                        : transaction.status === "partial"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </div>
              </div>

              {/* ITEMS */}
              {transaction.items?.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-bold text-gray-700 mb-4">
                    Purchased Items
                  </h4>

                  <div className="space-y-3">
                    {transaction.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between bg-gray-50 p-4 rounded-xl"
                      >
                        <div>
                          <p className="font-semibold">{item.productName}</p>

                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>

                        <h4 className="font-bold text-orange-500">
                          ₹ {item.price}
                        </h4>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PAYMENT DETAILS */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-gray-500 text-sm">Paid Amount</p>

                  <h3 className="text-xl font-bold text-green-600">
                    ₹ {transaction.paidAmount}
                  </h3>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-gray-500 text-sm">Remaining</p>

                  <h3 className="text-xl font-bold text-red-500">
                    ₹ {transaction.remainingAmount}
                  </h3>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-gray-500 text-sm">Due Date</p>

                  <h3 className="text-xl font-bold text-gray-700">
                    {transaction.dueDate
                      ? new Date(transaction.dueDate).toLocaleDateString()
                      : "N/A"}
                  </h3>
                </div>
              </div>
            </div>
          ))}

          {transactions.length === 0 && (
            <p className="text-gray-500">No transactions found</p>
          )}
        </div>
      </div>
    </div>
  );
}
