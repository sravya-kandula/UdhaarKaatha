import Customer from "../models/Customer.js";
import Notification from "../models/Notification.js";

// CHECK OVERDUE CUSTOMERS
const checkOverdueCustomers = async () => {
  try {
    // get today's date
    const today = new Date();

    // find customers with passed due date
    const overdueCustomers = await Customer.find({
      dueDate: { $lt: today },
      currentBalance: { $gt: 0 },
    });

    for (const customer of overdueCustomers) {
      // calculate overdue days
      const overdueDays = Math.floor(
        (today - customer.dueDate) / (1000 * 60 * 60 * 24),
      );

      // calculate fine
      const fine = overdueDays * customer.finePerDay;

      // update customer
      customer.status = "overdue";

      // optional: temporary field
      customer.totalFine = fine;

      await Notification.create({
        customerId: customer._id,
        shopkeeperId: customer.shopkeeperId,
        title: "Customer Overdue",
        message: `${customer.name} payment is overdue`,
        type: "overdue",
      });

      await customer.save();
    }

    console.log("Overdue customers checked");
  } catch (error) {
    console.log(error.message);
  }
};

export default checkOverdueCustomers;
