import { Routes, Route } from "react-router-dom";

import HomePage from "./components/HomePage";

import Login from "./pages/Login";
import Register from "./pages/Register";

import ShopkeeperDashboard from "./pages/ShopkeeperDashboard";

import Customers from "./pages/Customers";

import CustomerLedger from "./pages/CustomerLedger";

import Notifications from "./pages/Notifications";

import CustomerDashboard from "./pages/CustomerDashboard";

import CreateTransaction from "./pages/CreateTransaction";
import CustomerDetailsPage from "./pages/CustomerDetailsPage";
import CustomerShopPage from "./pages/CustomerShopPage";

function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<HomePage />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* SHOPKEEPER */}
      <Route path="/shopkeeper/dashboard" element={<ShopkeeperDashboard />} />

      <Route
        path="/shopkeeper/customer/:id"
        element={<CustomerDetailsPage />}
      />

      {/* CUSTOMER */}
      <Route path="/customer/dashboard" element={<CustomerDashboard />} />

      <Route
        path="/customer/shop/:shopkeeperId"
        element={<CustomerShopPage />}
      />

      {/* CUSTOMERS */}
      <Route path="/customers" element={<Customers />} />

      {/* LEDGER */}
      <Route path="/ledger/:customerId" element={<CustomerLedger />} />

      {/* TRANSACTIONS */}
      <Route path="/transactions/create" element={<CreateTransaction />} />

      {/* NOTIFICATIONS */}
      <Route path="/notifications" element={<Notifications />} />
    </Routes>
  );
}

export default App;
