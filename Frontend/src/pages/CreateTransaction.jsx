import { useEffect, useState } from "react";

import API from "../services/api";

export default function CreateTransaction() {
  const [customers, setCustomers] = useState([]);

  const [items, setItems] = useState([
    {
      productName: "",
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
        productName: "",
        quantity: 1,
        price: 0,
      },
    ]);
  };

  // TOTAL
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

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...formData,
        items,
        totalAmount,
      };

      await API.post("/transactions/add", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Transaction added successfully");

      // RESET
      setItems([
        {
          productName: "",
          quantity: 1,
          price: 0,
        },
      ]);

      setFormData({
        customerId: "",
        paymentType: "udhar",
        paidAmount: 0,
        dueDate: "",
      });

      setTotalAmount(0);
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 p-8">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Create Transaction
        </h1>

        <p className="text-gray-500 mt-2">Add products to customer khata</p>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* CUSTOMER */}
          <select
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            className="w-full border border-gray-300 p-4 rounded-2xl"
          >
            <option value="">Select Customer</option>

            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.name}
              </option>
            ))}
          </select>

          {/* ITEMS */}
          <div className="space-y-5">
            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <input
                  type="text"
                  placeholder="Product Name"
                  value={item.productName}
                  onChange={(e) =>
                    handleItemChange(index, "productName", e.target.value)
                  }
                  className="border border-gray-300 p-4 rounded-2xl"
                />

                <input
                  type="number"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", Number(e.target.value))
                  }
                  className="border border-gray-300 p-4 rounded-2xl"
                />

                <input
                  type="number"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) =>
                    handleItemChange(index, "price", Number(e.target.value))
                  }
                  className="border border-gray-300 p-4 rounded-2xl"
                />
              </div>
            ))}
          </div>

          {/* ADD ITEM */}
          <button
            type="button"
            onClick={addItem}
            className="bg-green-500 text-white px-6 py-3 rounded-2xl"
          >
            + Add Item
          </button>

          {/* TOTAL */}
          <div className="bg-orange-100 p-6 rounded-2xl">
            <h2 className="text-3xl font-bold text-orange-600">
              Total: ₹ {totalAmount}
            </h2>
          </div>

          {/* PAYMENT TYPE */}
          <select
            name="paymentType"
            value={formData.paymentType}
            onChange={handleChange}
            className="w-full border border-gray-300 p-4 rounded-2xl"
          >
            <option value="udhar">Add To Udhaar</option>

            <option value="paid">Paid Now</option>
          </select>

          {/* PARTIAL PAYMENT */}
          <input
            type="number"
            name="paidAmount"
            placeholder="Paid Amount"
            value={formData.paidAmount}
            onChange={handleChange}
            className="w-full border border-gray-300 p-4 rounded-2xl"
          />

          {/* DUE DATE */}
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full border border-gray-300 p-4 rounded-2xl"
          />

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-4 rounded-2xl font-semibold hover:bg-orange-600"
          >
            Create Transaction
          </button>
        </form>
      </div>
    </div>
  );
}
