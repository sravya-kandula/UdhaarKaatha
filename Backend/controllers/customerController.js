import Customer from "../models/Customer.js";

// ADD CUSTOMER
export const addCustomer = async (req, res) => {
  try {
    const { name, phone, address, udharLimit, finePerDay, dueDate } = req.body;

    // logged in shopkeeper id
    const shopkeeperId = req.user.id;

    // create customer
    const customer = await Customer.create({
      shopkeeperId,
      name,
      phone,
      address,
      udharLimit,
      finePerDay,
      dueDate,
    });

    res.status(201).json({
      success: true,
      message: "Customer added successfully",
      customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// GET ALL CUSTOMERS OF LOGGED-IN SHOPKEEPER
export const getCustomers = async (req, res) => {
  try {
    // logged-in shopkeeper id
    const shopkeeperId = req.user.id;

    // fetch only his customers
    const customers = await Customer.find({
      shopkeeperId,
      isArchived: false,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// FILTER + SEARCH CUSTOMERS
export const filterCustomers = async (req, res) => {
  try {
    const shopkeeperId = req.user.id;

    const { status, search } = req.query;

    // base query
    let query = {
      shopkeeperId,
      isArchived: false,
    };

    // filter by status
    if (status) {
      query.status = status;
    }

    // search by name or phone
    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const customers = await Customer.find(query).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ARCHIVE CUSTOMER
export const archiveCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const shopkeeperId = req.user.id;

    // find customer
    const customer = await Customer.findOne({
      _id: customerId,
      shopkeeperId,
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // only cleared customers can be archived
    if (customer.currentBalance > 0) {
      return res.status(400).json({
        success: false,
        message: "Customer still has pending balance",
      });
    }

    customer.isArchived = true;

    await customer.save();

    res.status(200).json({
      success: true,
      message: "Customer archived successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// RESTORE CUSTOMER
export const restoreCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const shopkeeperId = req.user.id;

    const customer = await Customer.findOne({
      _id: customerId,
      shopkeeperId,
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    customer.isArchived = false;

    await customer.save();

    res.status(200).json({
      success: true,
      message: "Customer restored successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// GET ARCHIVED CUSTOMERS
export const getArchivedCustomers = async (req, res) => {
  try {
    const shopkeeperId = req.user.id;

    const customers = await Customer.find({
      shopkeeperId,
      isArchived: true,
    });

    res.status(200).json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
