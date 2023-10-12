import { Schema, model } from 'mongoose';

const ticketCollection = 'tickets';

const TicketSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    datetime: { type: Date, required: true },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true},
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'products' },
        quantity: { type: Number, required: true, default: 0 },
        _id: false,
      },
    ],
    productsNotPurchased: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'products' },
        quantity: { type: Number, required: true, default: 0 },
        _id: false,
      },
    ],
  },
  { versionKey: false }
);



export const TicketsModel = model('tickets', TicketSchema);
