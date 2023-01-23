const mongoose = require("mongoose");

const eanMasterSchema = new mongoose.Schema(
  {
    eancode: {
      required: false,
      type: String,
    },
    itemCode: {
      required: false,
      type: String,
    },
    itemName: {
      required: false,
      type: String,
    },
    itemDescription: {
      required: false,
      type: String,
    },
    images: [
      {
        required: false,
        type: String,
      },
    ],
    mrp: {
      required: false,
      type: Number,
      default: 0,
    },
    /// [shelfLife] in days
    shelfLife: {
      required: false,
      type: Number,
      default: 0,
    },
    height: {
      required: false,
      type: Number,
      default: 0,
    },
    width: {
      required: false,
      type: Number,
      default: 0,
    },
    length: {
      required: false,
      type: Number,
      default: 0,
    },
    weight: {
      required: false,
      type: Number,
      default: 0,
    },
    /// [unit] gm, kg, ml, ltr, unit etc
    unit: {
      required: false,
      type: String,
      default: "gm",
    },
    quantity: {
      required: false,
      type: Number,
      default: 1,
    },
    isVeg: {
      required: false,
      type: Boolean,
      default: true,
    },
    updated: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);
eanMasterSchema.index({ itemName: "text" });
const EanMaster = new mongoose.model("EanMaster", eanMasterSchema);
module.exports = EanMaster;
