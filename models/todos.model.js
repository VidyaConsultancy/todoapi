const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    todo: { type: String, required: true },
    isCompleted: { type: Boolean, required: true, default: false },
    isDeleted: { type: Boolean, default: false },
    // createdAt:{type:Date,default:new Date()},
    // modifiedAt:{type:Date,default:new Date()},
    deletedAt: { type: Date, default: null },
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: "User"}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Todo", todoSchema);
