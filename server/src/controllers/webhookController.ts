import { Request, Response } from 'express';
import Transaction from '../models/Transaction';

// iv) Webhook for Status Updates
export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    console.log('📥 Received Webhook Payload:', JSON.stringify(payload, null, 2));

    if (!payload || !payload.order_info) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid payload structure. "order_info" object is required.',
      });
    }

    const { order_info } = payload;
    const order_id = order_info.order_id || order_info.custom_order_id || order_info.collect_id;

    if (!order_id) {
      return res.status(400).json({
        status: 400,
        message: 'Order ID is missing in order_info.',
      });
    }

    // Determine status string based on HTTP status in payload or payload properties
    let newStatus = 'Success';
    if (payload.status === 200 || payload.status === '200' || payload.status === 'SUCCESS' || payload.status === 'Success') {
      newStatus = 'Success';
    } else if (payload.status === 400 || payload.status === 'FAILED' || payload.status === 'Failed') {
      newStatus = 'Failed';
    } else if (payload.status === 'PENDING' || payload.status === 'Pending') {
      newStatus = 'Pending';
    }

    // Find transaction by order_id matching custom_order_id OR collect_id OR _id
    const query = {
      $or: [
        { custom_order_id: order_id },
        { collect_id: order_id },
      ],
    };

    const updateData: any = {
      status: newStatus,
    };

    if (order_info.order_amount) updateData.order_amount = order_info.order_amount;
    if (order_info.transaction_amount) updateData.transaction_amount = order_info.transaction_amount;
    if (order_info.gateway) updateData.gateway = order_info.gateway;
    if (order_info.bank_reference) updateData.bank_reference = order_info.bank_reference;

    let transaction = await Transaction.findOneAndUpdate(query, { $set: updateData }, { new: true });

    // If transaction not found, optionally auto-create or return 404
    if (!transaction) {
      console.log(`⚠️ Transaction with ID ${order_id} not found. Auto-creating record from webhook payload...`);
      transaction = await Transaction.create({
        collect_id: order_info.order_id || `collect_${Date.now()}`,
        school_id: order_info.school_id || '65b0e6293e9f76a9694d84b4',
        gateway: order_info.gateway || 'PhonePe',
        order_amount: order_info.order_amount || 2000,
        transaction_amount: order_info.transaction_amount || 2200,
        status: newStatus,
        custom_order_id: order_id,
        bank_reference: order_info.bank_reference || 'YESBNK222',
        institute_name: 'ST. PATRICKS SENIOR SECONDARY SCHOOL',
        payment_method: 'UPI',
        student_name: 'Webhook Student',
      });
    }

    return res.status(200).json({
      status: 200,
      message: 'Webhook processed successfully. Transaction updated.',
      data: {
        order_id: transaction.custom_order_id,
        collect_id: transaction.collect_id,
        status: transaction.status,
        transaction_amount: transaction.transaction_amount,
        gateway: transaction.gateway,
        bank_reference: transaction.bank_reference,
      },
    });
  } catch (error: any) {
    console.error('❌ Webhook error:', error);
    return res.status(500).json({ status: 500, message: error.message });
  }
};
