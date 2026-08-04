import Transaction from '../models/Transaction';
import User from '../models/User';
import bcrypt from 'bcryptjs';

const SAMPLE_SCHOOLS = [
  { id: '65b0e6293e9f76a9694d84b4', name: 'ST. PATRICKS SENIOR SECONDARY SCHOOL' },
  { id: '65b0e6293e9f76a9694d84b5', name: 'DELHI PUBLIC SCHOOL (DPS)' },
  { id: '65b0e6293e9f76a9694d84b6', name: 'ST. XAVIERS HIGH SCHOOL' },
  { id: '65b0e6293e9f76a9694d84b7', name: 'GREENWOOD INTERNATIONAL SCHOOL' },
  { id: '65b0e6293e9f76a9694d84b8', name: 'RYAN INTERNATIONAL SCHOOL' },
];

const GATEWAYS = ['PhonePe', 'Razorpay', 'PayTM', 'EDVIRON', 'CCAvenue'];
const PAYMENT_METHODS = ['Net Banking', 'UPI', 'Credit Card', 'Debit Card', 'Wallet'];
const STUDENT_NAMES = [
  'Abhay Sharma', 'Priya Patel', 'Rahul Verma', 'Sneha Gupta', 'Rohan Mehta',
  'Ananya Roy', 'Vikram Singh', 'Kavya Nair', 'Aditya Joshi', 'Neha Kapoor',
  'Aarav Kumar', 'Ishita Deshmukh', 'Karan Malhotra', 'Riya Sen', 'Siddharth Iyer'
];

export const seedDatabase = async (force: boolean = false): Promise<void> => {
  try {
    // ALWAYS ensure Default Admin User exists
    const existingAdmin = await User.findOne({ email: 'admin@school.com' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Admin User',
        email: 'admin@school.com',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('👤 Default Admin User created (email: admin@school.com, password: admin123)');
    }

    const existingCount = await Transaction.countDocuments();
    if (existingCount > 0 && !force) {
      console.log(`ℹ️ Database already contains ${existingCount} transactions. Skipping initial transaction seed.`);
      return;
    }

    if (force) {
      await Transaction.deleteMany({});
      console.log('🧹 Cleared existing transaction records.');
    }

    // Seed transactions
    const transactions = [];
    const now = new Date();

    for (let i = 1; i <= 60; i++) {
      const schoolObj = SAMPLE_SCHOOLS[i % SAMPLE_SCHOOLS.length];
      const status = i <= 35 ? 'Success' : i <= 50 ? 'Pending' : 'Failed';
      const gateway = GATEWAYS[i % GATEWAYS.length];
      const paymentMethod = PAYMENT_METHODS[i % PAYMENT_METHODS.length];
      const studentName = STUDENT_NAMES[i % STUDENT_NAMES.length];

      const orderAmt = Math.floor(Math.random() * 5000) + 1000;
      const transAmt = status === 'Failed' ? 0 : orderAmt + (status === 'Success' ? Math.floor(Math.random() * 200) : 0);

      const daysAgo = Math.floor(Math.random() * 30);
      const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000 - Math.random() * 3600000);

      const collectId = `675bcc${(10000 + i).toString(16)}14e56eefb0${(100 + i)}`;
      const customOrderId = `608A17340625${700000 + i}`;
      const bankRef = status === 'Success' ? `YESBNK${220 + i}` : 'NA';

      transactions.push({
        collect_id: collectId,
        school_id: schoolObj.id,
        institute_name: schoolObj.name,
        gateway: gateway,
        payment_method: paymentMethod,
        order_amount: orderAmt,
        transaction_amount: transAmt,
        status: status,
        custom_order_id: customOrderId,
        student_name: studentName,
        phone_no: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
        vendor_amount: Math.round(orderAmt * 0.95),
        bank_reference: bankRef,
        createdAt: createdAt,
        updatedAt: createdAt,
      });
    }

    await Transaction.insertMany(transactions);
    console.log(`✨ Seeded ${transactions.length} dummy transaction records successfully!`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};
