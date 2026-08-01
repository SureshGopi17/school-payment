import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  collect_id: string;
  school_id: string;
  gateway: string;
  order_amount: number;
  transaction_amount: number;
  status: 'Success' | 'Pending' | 'Failed' | 'SUCCESS' | 'PENDING' | 'FAILED';
  custom_order_id: string;
  institute_name?: string;
  payment_method?: string;
  student_name?: string;
  phone_no?: string;
  vendor_amount?: number;
  bank_reference?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    collect_id: { type: String, required: true, index: true },
    school_id: { type: String, required: true, index: true },
    gateway: { type: String, required: true },
    order_amount: { type: Number, required: true },
    transaction_amount: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ['Success', 'Pending', 'Failed', 'SUCCESS', 'PENDING', 'FAILED'],
      default: 'Pending',
    },
    custom_order_id: { type: String, required: true, unique: true, index: true },
    institute_name: { type: String, default: 'ST. PATRICKS SENIOR SECONDARY SCHOOL' },
    payment_method: { type: String, default: 'Net Banking' },
    student_name: { type: String, default: 'Student' },
    phone_no: { type: String, default: '9876543210' },
    vendor_amount: { type: Number, default: 0 },
    bank_reference: { type: String, default: 'NA' },
  },
  {
    timestamps: true,
  }
);

// Add index for searching and filtering
TransactionSchema.index({ createdAt: -1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ school_id: 1, createdAt: -1 });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
