import { useEffect, useState } from "react";

import API from "../services/api";

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    udharLimit: "",
    finePerDay: "",
    dueDate: "",
  });

  // FETCH CUSTOMERS
  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await API.get("/customers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCustomers(data.customers);

      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // HANDLE INPUTS
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ADD CUSTOMER
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await API.post("/customers/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Customer added successfully");

      // REFRESH
      fetchCustomers();

      // RESET FORM
      setFormData({
        name: "",
        phone: "",
        address: "",
        udharLimit: "",
        finePerDay: "",
        dueDate: "",
      });
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading Customers...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 p-8">
      {/* HEADING */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Customer Management
        </h1>

        <p className="text-gray-500 mt-2">Manage customer udhaar accounts</p>
      </div>

      {/* ADD CUSTOMER */}
      <div className="bg-white rounded-3xl shadow-lg p-8 mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Customer</h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <input
            type="text"
            name="name"
            placeholder="Customer Name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 p-4 rounded-2xl outline-none focus:border-orange-500"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="border border-gray-300 p-4 rounded-2xl outline-none focus:border-orange-500"
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="border border-gray-300 p-4 rounded-2xl outline-none focus:border-orange-500"
          />

          <input
            type="number"
            name="udharLimit"
            placeholder="Udhar Limit"
            value={formData.udharLimit}
            onChange={handleChange}
            className="border border-gray-300 p-4 rounded-2xl outline-none focus:border-orange-500"
          />

          <input
            type="number"
            name="finePerDay"
            placeholder="Fine Per Day"
            value={formData.finePerDay}
            onChange={handleChange}
            className="border border-gray-300 p-4 rounded-2xl outline-none focus:border-orange-500"
          />

          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="border border-gray-300 p-4 rounded-2xl outline-none focus:border-orange-500"
          />

          <button
            type="submit"
            className="md:col-span-2 bg-orange-500 text-white py-4 rounded-2xl font-semibold hover:bg-orange-600 transition"
          >
            Add Customer
          </button>
        </form>
      </div>

      {/* CUSTOMER LIST */}
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Customers List
        </h2>

        <div className="space-y-5">
          {customers.map((customer) => (
            <div
              key={customer._id}
              className="border rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              {/* LEFT */}
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {customer.name}
                </h3>

                <p className="text-gray-500">{customer.phone}</p>

                <p className="text-gray-500">{customer.address}</p>
              </div>

              {/* CENTER */}
              <div>
                <p className="text-sm text-gray-500">Current Balance</p>

                <h3 className="text-2xl font-bold text-red-500">
                  ₹ {customer.currentBalance}
                </h3>
              </div>

              {/* RIGHT */}
              <div className="text-right">
                <p className="text-sm text-gray-500">Due Date</p>

                <p className="font-semibold">
                  {new Date(customer.dueDate).toLocaleDateString()}
                </p>

                {/* STATUS */}
                <span
                  className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-semibold ${
                    customer.status === "cleared"
                      ? "bg-green-100 text-green-600"
                      : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {customer.status}
                </span>
              </div>
            </div>
          ))}

          {customers.length === 0 && (
            <p className="text-gray-500">No customers added yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
