import { useEffect, useState } from "react";
import API from "../services/api";

export default function CreateTransaction() {
  const [customers, setCustomers] = useState([]);

  const [isNewCustomer, setIsNewCustomer] = useState(false);

  const [items, setItems] = useState([
    {
      itemName: "",
      quantity: 1,
      price: 0,
    },
  ]);

  const [formData, setFormData] = useState({
    customerId: "",
    paymentType: "udhar",
    paidAmount: 0,
    dueDate: "",
  });

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    udharLimit: 5000,
  });

  const [totalAmount, setTotalAmount] = useState(0);

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
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // HANDLE ITEMS
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];

    updatedItems[index][field] = value;

    setItems(updatedItems);

    calculateTotal(updatedItems);
  };

  // ADD ITEM
  const addItem = () => {
    setItems([
      ...items,
      {
        itemName: "",
        quantity: 1,
        price: 0,
      },
    ]);
  };

  // REMOVE ITEM
  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);

    setItems(updatedItems);

    calculateTotal(updatedItems);
  };

  // CALCULATE TOTAL
  const calculateTotal = (updatedItems) => {
    const total = updatedItems.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0,
    );

    setTotalAmount(total);
  };

  // HANDLE FORM
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // HANDLE NEW CUSTOMER
  const handleNewCustomerChange = (e) => {
    setNewCustomer({
      ...newCustomer,
      [e.target.name]: e.target.value,
    });
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      let customerId = formData.customerId;

      // CREATE CUSTOMER IF NEW
      if (isNewCustomer) {
        const customerResponse = await API.post("/customers/add", newCustomer, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        customerId = customerResponse.data.customer._id;
      }

      // VALIDATION
      if (!customerId) {
        return alert("Please select or create customer");
      }

      if (items.length === 0) {
        return alert("Please add at least one item");
      }

      // PAYLOAD
      const payload = {
        customerId,
        items,
        totalAmount,
        paymentType: formData.paymentType,
        paidAmount: Number(formData.paidAmount),
        dueDate: formData.dueDate,
      };

      // API CALL
      await API.post("/transactions/add", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Transaction created successfully");

      // RESET ITEMS
      setItems([
        {
          itemName: "",
          quantity: 1,
          price: 0,
        },
      ]);

      // RESET FORM
      setFormData({
        customerId: "",
        paymentType: "udhar",
        paidAmount: 0,
        dueDate: "",
      });

      // RESET CUSTOMER
      setNewCustomer({
        name: "",
        phone: "",
        address: "",
        udharLimit: 5000,
      });

      setTotalAmount(0);

      fetchCustomers();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 p-6 md:p-10">
      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-5xl font-extrabold text-gray-800">
          Create Transaction
        </h1>

        <p className="text-gray-500 mt-3 text-lg">
          Add customer purchases and manage udhaar digitally.
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white rounded-[35px] shadow-2xl border border-orange-100 p-8 md:p-12">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* CUSTOMER SECTION */}
          <div className="bg-orange-50 border border-orange-100 rounded-3xl p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Customer Information
              </h2>

              <button
                type="button"
                onClick={() => setIsNewCustomer(!isNewCustomer)}
                className="px-6 py-3 rounded-2xl bg-orange-500 text-white font-semibold shadow-lg hover:bg-orange-600 transition"
              >
                {isNewCustomer ? "Choose Existing" : "+ Add New Customer"}
              </button>
            </div>

            {!isNewCustomer ? (
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  Select Existing Customer
                </label>

                <select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  className="w-full border-2 border-orange-200 p-5 rounded-2xl bg-white text-lg focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
                >
                  <option value="">Choose Customer</option>

                  {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.name} • {customer.phone}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* NAME */}
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Customer Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter customer name"
                    value={newCustomer.name}
                    onChange={handleNewCustomerChange}
                    required
                    className="w-full border-2 border-gray-200 p-5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
                  />
                </div>

                {/* PHONE */}
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    name="phone"
                    placeholder="9876543210"
                    value={newCustomer.phone}
                    onChange={handleNewCustomerChange}
                    required
                    className="w-full border-2 border-gray-200 p-5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
                  />
                </div>

                {/* ADDRESS */}
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Address
                  </label>

                  <input
                    type="text"
                    name="address"
                    placeholder="Customer address"
                    value={newCustomer.address}
                    onChange={handleNewCustomerChange}
                    className="w-full border-2 border-gray-200 p-5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
                  />
                </div>

                {/* LIMIT */}
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Udhaar Limit
                  </label>

                  <input
                    type="number"
                    name="udharLimit"
                    value={newCustomer.udharLimit}
                    onChange={handleNewCustomerChange}
                    className="w-full border-2 border-gray-200 p-5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
                  />
                </div>
              </div>
            )}
          </div>

          {/* PRODUCTS */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              Product Details
            </h2>

            <div className="space-y-6">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded-3xl p-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* ITEM NAME */}
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-3">
                        Product Name
                      </label>

                      <input
                        type="text"
                        placeholder="Enter product name"
                        value={item.itemName}
                        onChange={(e) =>
                          handleItemChange(index, "itemName", e.target.value)
                        }
                        required
                        className="w-full border-2 border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
                      />
                    </div>

                    {/* QUANTITY */}
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-3">
                        Quantity
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "quantity",
                            Number(e.target.value),
                          )
                        }
                        required
                        className="w-full border-2 border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
                      />
                    </div>

                    {/* PRICE */}
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-3">
                        Price
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={item.price}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "price",
                            Number(e.target.value),
                          )
                        }
                        required
                        className="w-full border-2 border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
                      />
                    </div>
                  </div>

                  {/* REMOVE ITEM */}
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="mt-5 bg-red-500 text-white px-5 py-2 rounded-xl hover:bg-red-600 transition"
                    >
                      Remove Item
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* ADD PRODUCT BUTTON */}
            <button
              type="button"
              onClick={addItem}
              className="mt-6 bg-green-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:bg-green-600 hover:scale-105 transition"
            >
              + Add Product
            </button>
          </div>

          {/* TOTAL */}
          <div className="bg-orange-100 border border-orange-200 p-8 rounded-3xl">
            <h2 className="text-4xl font-extrabold text-orange-600">
              Total Amount: ₹ {totalAmount}
            </h2>
          </div>

          {/* PAYMENT SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* PAYMENT TYPE */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Payment Type
              </label>

              <select
                name="paymentType"
                value={formData.paymentType}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 p-5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
              >
                <option value="udhar">Add To Udhaar</option>

                <option value="paid">Paid Fully</option>
              </select>
            </div>

            {/* PAID AMOUNT */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Paid Amount
              </label>

              <input
                type="number"
                min="0"
                max={totalAmount}
                name="paidAmount"
                placeholder="Enter paid amount"
                value={formData.paidAmount}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 p-5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
              />
            </div>

            {/* DUE DATE */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Due Date
              </label>

              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 p-5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
              />
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-5 rounded-3xl text-xl font-bold shadow-xl hover:bg-orange-600 hover:scale-[1.01] transition"
          >
            Create Transaction
          </button>
        </form>
      </div>
    </div>
  );
}
