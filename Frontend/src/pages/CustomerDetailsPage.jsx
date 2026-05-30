import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

export default function CustomerDetailsPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);

  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showUdharModal, setShowUdharModal] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // UDHAR FORM
  const [udharForm, setUdharForm] = useState({
    itemName: "",
    quantity: 1,
    price: "",
    totalAmount: "",
    paidAmount: "",
    dueDate: "",
  });

  // PAYMENT FORM
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
  });

  // FETCH CUSTOMER LEDGER
  const fetchCustomerLedger = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await API.get(`/transactions/ledger/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCustomer(data.customer);

      setTransactions(data.transactions || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerLedger();
  }, []);

  // ADD UDHAR
  const handleAddUdhar = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/transactions/add",
        {
          customerId: id,

          items: [
            {
              itemName: udharForm.itemName,
              quantity: Number(udharForm.quantity),
              price: Number(udharForm.price),
            },
          ],

          totalAmount: Number(udharForm.totalAmount),

          paidAmount: Number(udharForm.paidAmount || 0),

          remainingAmount:
            Number(udharForm.totalAmount) - Number(udharForm.paidAmount || 0),

          paymentType: Number(udharForm.paidAmount) > 0 ? "paid" : "udhar",

          transactionType: "purchase",

          dueDate: udharForm.dueDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUdharForm({
        itemName: "",
        quantity: 1,
        price: "",
        totalAmount: "",
        paidAmount: "",
        dueDate: "",
      });

      setShowUdharModal(false);

      fetchCustomerLedger();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Failed to add udhar");
    }
  };

  // RECORD PAYMENT
  const handleRecordPayment = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/transactions/payment",
        {
          customerId: id,
          amount: Number(paymentForm.amount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPaymentForm({
        amount: "",
      });

      setShowPaymentModal(false);

      fetchCustomerLedger();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Payment failed");
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <h1 className="text-3xl font-bold mt-6 text-gray-700">
            Loading Customer...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* TOP NAVBAR */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/shopkeeper/dashboard")}
              className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 text-2xl"
            >
              ←
            </button>

            <div>
              <h1 className="text-4xl font-black text-gray-800">
                {customer?.name}
              </h1>

              <p className="text-gray-500 mt-1">{customer?.phone}</p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex gap-4">
            <button
              onClick={() => setShowUdharModal(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-7 py-4 rounded-2xl font-bold text-lg"
            >
              + Add Udhar
            </button>

            <button
              onClick={() => setShowPaymentModal(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-7 py-4 rounded-2xl font-bold text-lg"
            >
              + Record Payment
            </button>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* CUSTOMER INFO */}
        <div className="bg-white rounded-[35px] p-8 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* BALANCE */}
            <div className="bg-red-50 rounded-[30px] p-7">
              <p className="text-gray-600 text-lg">Current Udhar</p>

              <h1 className="text-5xl font-black text-red-500 mt-4">
                ₹ {customer?.currentBalance || 0}
              </h1>
            </div>

            {/* TRANSACTIONS */}
            <div className="bg-blue-50 rounded-[30px] p-7">
              <p className="text-gray-600 text-lg">Transactions</p>

              <h1 className="text-5xl font-black text-blue-500 mt-4">
                {transactions.length}
              </h1>
            </div>

            {/* DUE DATE */}
            <div className="bg-orange-50 rounded-[30px] p-7">
              <p className="text-gray-600 text-lg">Due Date</p>

              <h1 className="text-3xl font-black text-orange-500 mt-4">
                {customer?.dueDate
                  ? new Date(customer.dueDate).toLocaleDateString()
                  : "No Date"}
              </h1>
            </div>
          </div>
        </div>

        {/* TRANSACTIONS */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-black text-gray-800">
                Recent Transactions
              </h1>

              <p className="text-gray-500 mt-2">Payment & udhar history</p>
            </div>
          </div>

          {/* TRANSACTION LIST */}
          {transactions.length > 0 ? (
            <div className="space-y-5">
              {transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="bg-white rounded-[30px] p-6 shadow-md border border-gray-100"
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
                        {transaction.transactionType === "payment"
                          ? "💰"
                          : "🧾"}
                      </div>

                      <div>
                        <h2 className="text-2xl font-black text-gray-800">
                          {transaction.transactionType === "payment"
                            ? "Payment Received"
                            : "Udhar Added"}
                        </h2>

                        <p className="text-gray-500 mt-1 capitalize">
                          {transaction.paymentType}
                        </p>

                        <p className="text-gray-400 mt-2 text-sm">
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
                          : transaction.remainingAmount ||
                            transaction.totalAmount}
                      </h1>

                      <div
                        className={`inline-block mt-3 px-4 py-2 rounded-full text-sm font-bold capitalize ${
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
          ) : (
            <div className="bg-white rounded-[35px] p-20 text-center shadow-md">
              <div className="text-8xl">📭</div>

              <h1 className="text-4xl font-black text-gray-800 mt-6">
                No Transactions Yet
              </h1>

              <p className="text-gray-500 text-lg mt-4">
                Add udhar or record payment to start tracking.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ADD UDHAR MODAL */}
      {showUdharModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-5">
          <div className="bg-white w-full max-w-2xl rounded-[35px] p-8 shadow-2xl">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-black text-gray-800">Add Udhar</h1>

                <p className="text-gray-500 mt-2">Add new udhar transaction</p>
              </div>

              <button
                onClick={() => setShowUdharModal(false)}
                className="text-3xl text-gray-400 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUdhar} className="space-y-6">
              {/* ITEM NAME */}
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Item Name
                </label>

                <input
                  type="text"
                  required
                  placeholder="Enter item name"
                  value={udharForm.itemName}
                  onChange={(e) =>
                    setUdharForm({
                      ...udharForm,
                      itemName: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-lg"
                />
              </div>

              {/* QUANTITY */}
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Quantity
                </label>

                <input
                  type="number"
                  required
                  min="1"
                  value={udharForm.quantity}
                  onChange={(e) =>
                    setUdharForm({
                      ...udharForm,
                      quantity: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-lg"
                />
              </div>

              {/* PRICE */}
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Price Per Item
                </label>

                <input
                  type="number"
                  required
                  placeholder="Enter item price"
                  value={udharForm.price}
                  onChange={(e) => {
                    const value = e.target.value;

                    setUdharForm({
                      ...udharForm,
                      price: value,
                      totalAmount:
                        Number(value) * Number(udharForm.quantity || 1),
                    });
                  }}
                  className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-lg"
                />
              </div>

              {/* TOTAL */}
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Total Amount
                </label>

                <input
                  type="number"
                  required
                  value={udharForm.totalAmount}
                  readOnly
                  className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-lg bg-gray-100"
                />
              </div>

              {/* PAID */}
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Paid Amount
                </label>

                <input
                  type="number"
                  placeholder="0"
                  value={udharForm.paidAmount}
                  onChange={(e) =>
                    setUdharForm({
                      ...udharForm,
                      paidAmount: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-lg"
                />
              </div>

              {/* DUE DATE */}
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Due Date
                </label>

                <input
                  type="date"
                  required
                  value={udharForm.dueDate}
                  onChange={(e) =>
                    setUdharForm({
                      ...udharForm,
                      dueDate: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl text-xl font-bold"
              >
                Add Udhar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-5">
          <div className="bg-white w-full max-w-xl rounded-[35px] p-8 shadow-2xl">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-black text-gray-800">
                  Record Payment
                </h1>

                <p className="text-gray-500 mt-2">Add customer payment</p>
              </div>

              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-3xl text-gray-400 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleRecordPayment} className="space-y-6">
              <input
                type="number"
                required
                placeholder="Enter Amount"
                value={paymentForm.amount}
                onChange={(e) =>
                  setPaymentForm({
                    amount: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-lg"
              />

              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl text-xl font-bold"
              >
                Record Payment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
