// models/PerformanceLog.js
const mongoose = require('mongoose');

const performanceLogSchema = new mongoose.Schema({
  endpoint: { type: String, index: true }, // Indexing the 'endpoint' field
  source: { type: String, index: true }, // Indexing the 'source' field
  responseTime: Number,
  timestamp: { type: Date, default: Date.now, index: true }, // Indexing the 'timestamp' field
});

performanceLogSchema.index({ endpoint: 1, source: 1 });

module.exports = mongoose.model('PerformanceLog', performanceLogSchema);
