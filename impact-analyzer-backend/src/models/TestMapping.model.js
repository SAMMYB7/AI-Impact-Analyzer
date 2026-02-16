const mongoose = require("mongoose");

const testMappingSchema = new mongoose.Schema({
  filePath: { type: String, required: true },
  module: { type: String, required: true },
  relatedTests: [String],
  priority: { type: Number, default: 1 },
  coverageImpact: { type: Number, default: 0 },
});

// Index filePath for fast lookups
testMappingSchema.index({ filePath: 1 });

module.exports = mongoose.model("TestMapping", testMappingSchema);
