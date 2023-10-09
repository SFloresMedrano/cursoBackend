import { Schema, model } from 'mongoose';

const ticketCollection = 'tickets';

const TicketSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    datetime: { type: Date, default: Date.now(), required: true },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true},
    products: [
      {
        id: { type: Schema.Types.ObjectId, ref: 'products' },
        quantity: { type: Number, required: true, default: 0 },
        _id: false,
      },
    ],
  },
  { versionKey: false }
);

TicketSchema.pre('find', function () {
  this.populate('products.id');
});

TicketSchema.pre('findOne', function () {
  this.populate('products.id');
});


export const TicketsModel = model('tickets', TicketSchema);
