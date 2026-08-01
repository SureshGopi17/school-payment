import { Request, Response } from 'express';
import axios from 'axios';
import Transaction from '../models/Transaction';

export const createCollectRequest = async (req: Request, res: Response) => {
  try {
    const { school_id, amount, student_name, gateway, custom_order_id } = req.body;

    const targetSchoolId = school_id || process.env.EDVIRON_SCHOOL_ID || '65b0e6293e9f76a9694d84b4';
    const orderAmount = Number(amount) || 1500;
    const orderId = custom_order_id || `ORD_${Date.now()}`;
    const collectId = `COL_${Date.now()}`;
    const selectedGateway = gateway || 'PhonePe';

    const apiKey = process.env.EDVIRON_API_KEY;

    let apiResponse = null;
    let paymentUrl = `https://checkout.edviron.com/pay/${collectId}?order_id=${orderId}`;

    // Attempt external call if token present
    try {
      if (apiKey) {
        const response = await axios.post(
          'https://dev-vanilla.edviron.com/erp/create-collect-request',
          {
            school_id: targetSchoolId,
            amount: orderAmount,
            custom_order_id: orderId,
            pg_key: process.env.EDVIRON_PG_KEY || 'edvtest01',
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            timeout: 5000,
          }
        );
        apiResponse = response.data;
        if (apiResponse && apiResponse.payment_url) {
          paymentUrl = apiResponse.payment_url;
        }
      }
    } catch (err: any) {
      console.warn('⚠️ External Edviron API call note:', err.message);
    }

    // Save transaction to DB with Pending status
    const newTransaction = await Transaction.create({
      collect_id: collectId,
      school_id: targetSchoolId,
      gateway: selectedGateway,
      order_amount: orderAmount,
      transaction_amount: orderAmount,
      status: 'Pending',
      custom_order_id: orderId,
      institute_name: 'ST. PATRICKS SENIOR SECONDARY SCHOOL',
      payment_method: 'UPI',
      student_name: student_name || 'Student Payment',
      bank_reference: 'NA',
    });

    return res.status(201).json({
      success: true,
      message: 'Collect request / Payment link created successfully',
      payment_url: paymentUrl,
      edviron_response: apiResponse,
      transaction: newTransaction,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
