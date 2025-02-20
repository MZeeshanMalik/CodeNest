import { kMaxLength } from "buffer";

const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
    kMaxLength: [10000, "Message length exceed than chracters limit(10000)."],
  },
  status: {
    type: String,
    enum: ["pending", "fulfilled"],
    default: "pending",
  },
});

const Contact = mongoose.model("contact", contactSchema);

export default Contact;
