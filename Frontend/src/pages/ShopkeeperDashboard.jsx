import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function ShopkeeperDashboard() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

  const [customerForm, setCustomerForm] = useState({
    name: "",
    phone: "",
    address: "",
    udharLimit: "",
    finePerDay: "",
    dueDate: "",
  });
  const user = JSON.parse(localStorage.getItem("user"));

  // FETCH CUSTOMERS
  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await API.get("/customers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCustomers(data.customers || []);
    } catch (error) {
      console.log(error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ADD CUSTOMER
  const handleAddCustomer = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const { data } = await API.post("/customers/add", customerForm, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCustomers((prev) => [data.customer, ...prev]);

      setCustomerForm({
        name: "",
        phone: "",
        address: "",
        udharLimit: "",
        finePerDay: "",
        dueDate: "",
      });

      setShowAddCustomerModal(false);
    } catch (error) {
      console.log(error);
      alert("Failed to add customer");
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <h1 className="text-3xl font-bold mt-6 text-gray-700">
            Loading Dashboard...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* TOP NAVBAR */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          {/* LEFT */}
          <div>
            <h1 className="text-4xl font-black text-gray-800">
              Hi, {user?.name} 👋
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              Manage customer udhaar digitally
            </p>
          </div>

          {/* RIGHT */}
          <button
            onClick={() => setShowAddCustomerModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-4 rounded-2xl font-bold text-lg transition duration-300 shadow-lg"
          >
            + Add Customer
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* TITLE */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-black text-gray-800">
              Your Customers
            </h2>

            <p className="text-gray-500 mt-2">
              Open any customer to manage udhaar & payments
            </p>
          </div>

          <div className="bg-white px-6 py-4 rounded-2xl shadow-md">
            <h2 className="text-gray-500 font-semibold">Total Customers</h2>

            <h1 className="text-4xl font-black text-blue-600 mt-2">
              {customers.length}
            </h1>
          </div>
        </div>

        {/* CUSTOMER LIST */}
        {customers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {customers.map((customer) => (
              <div
                key={customer._id}
                className="bg-white rounded-[30px] p-7 shadow-md hover:shadow-2xl transition duration-300 border border-gray-100"
              >
                {/* TOP */}
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-black text-gray-800">
                      {customer.name}
                    </h1>

                    <p className="text-gray-500 mt-2 text-lg">
                      {customer.phone}
                    </p>
                  </div>

                  <div
                    className={`px-4 py-2 rounded-full text-sm font-bold capitalize ${
                      customer.status === "cleared"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {customer.status}
                  </div>
                </div>

                {/* BALANCE */}
                <div className="mt-8">
                  <p className="text-gray-500 text-lg">Current Udhaar</p>

                  <h1 className="text-5xl font-black text-red-500 mt-3">
                    ₹ {customer.currentBalance || 0}
                  </h1>
                </div>

                {/* DUE DATE */}
                <div className="mt-6">
                  <p className="text-gray-500 font-medium">Due Date</p>

                  <p className="text-xl font-bold text-gray-700 mt-1">
                    {customer.dueDate
                      ? new Date(customer.dueDate).toLocaleDateString()
                      : "No Due Date"}
                  </p>
                </div>

                {/* BUTTON */}
                <button
                  onClick={() =>
                    navigate(`/shopkeeper/customer/${customer._id}`)
                  }
                  className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl text-xl font-bold transition duration-300"
                >
                  Open Customer
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[35px] shadow-md p-20 text-center">
            <div className="text-8xl">📭</div>

            <h1 className="text-4xl font-black text-gray-800 mt-6">
              No Customers Added
            </h1>

            <p className="text-gray-500 text-lg mt-4">
              Start by adding your first udhaar customer
            </p>

            <button
              onClick={() => setShowAddCustomerModal(true)}
              className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg"
            >
              + Add First Customer
            </button>
          </div>
        )}
      </div>

      {/* ADD CUSTOMER MODAL */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-5">
          <div className="bg-white w-full max-w-2xl rounded-[35px] p-8 shadow-2xl overflow-y-auto max-h-[95vh]">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-black text-gray-800">
                  Add Customer
                </h1>

                <p className="text-gray-500 mt-2">Create new udhaar customer</p>
              </div>

              <button
                onClick={() => setShowAddCustomerModal(false)}
                className="text-3xl text-gray-400 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleAddCustomer} className="space-y-6">
              {/* NAME */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Customer Name
                </label>

                <input
                  type="text"
                  required
                  value={customerForm.name}
                  onChange={(e) =>
                    setCustomerForm({
                      ...customerForm,
                      name: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-lg outline-none focus:border-blue-500"
                  placeholder="Enter customer name"
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Phone Number
                </label>

                <input
                  type="text"
                  required
                  value={customerForm.phone}
                  onChange={(e) =>
                    setCustomerForm({
                      ...customerForm,
                      phone: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-lg outline-none focus:border-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              {/* ADDRESS */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Address
                </label>

                <textarea
                  rows="3"
                  value={customerForm.address}
                  onChange={(e) =>
                    setCustomerForm({
                      ...customerForm,
                      address: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-lg outline-none focus:border-blue-500"
                  placeholder="Enter address"
                />
              </div>

              {/* LIMIT + FINE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2">
                    Udhaar Limit
                  </label>

                  <input
                    type="number"
                    required
                    value={customerForm.udharLimit}
                    onChange={(e) =>
                      setCustomerForm({
                        ...customerForm,
                        udharLimit: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-lg outline-none focus:border-blue-500"
                    placeholder="5000"
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2">
                    Fine Per Day
                  </label>

                  <input
                    type="number"
                    required
                    value={customerForm.finePerDay}
                    onChange={(e) =>
                      setCustomerForm({
                        ...customerForm,
                        finePerDay: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-lg outline-none focus:border-blue-500"
                    placeholder="10"
                  />
                </div>
              </div>

              {/* DUE DATE */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Due Date
                </label>

                <input
                  type="date"
                  required
                  value={customerForm.dueDate}
                  onChange={(e) =>
                    setCustomerForm({
                      ...customerForm,
                      dueDate: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-lg outline-none focus:border-blue-500"
                />
              </div>

              {/* BUTTONS */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-4 rounded-2xl font-bold text-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg"
                >
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
