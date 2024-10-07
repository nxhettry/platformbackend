const paymentCategory = {
  esewa: {
    email: {
      type: String,
      required: true,
    },
    phonenumber: {
      type: Number,
      required: true,
    },
  },
  khalti: {
    email: {
      type: String,
      required: true,
    },
    phonenumber: {
      type: Number,
      required: true,
    },
  },
  banktransfer: {
    accname: {
      type: String,
      required: true,
    },
    accnumber: {
      type: Number,
      required: true,
    },
    bankname: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: false,
    },
  },
  paytm: {
    name: {
      type: String,
      required: true,
    },
    accnumber: {
      type: Number,
      required: true,
    },
    phonenumber: {
      type: Number,
      required: true,
    },
  },
  upi: {
    name: {
      type: String,
      required: true,
    },
    upiid: {
      type: String,
      required: true,
    },
  },
  paypal: {
    email: {
      type: String,
      required: true,
    },
  },
  stripe: {
    email: {
      type: String,
      required: true,
    },
  },
};

export default paymentCategory;
