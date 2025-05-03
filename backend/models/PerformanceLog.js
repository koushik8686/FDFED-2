// models/PerformanceLog.js
const mongoose = require('mongoose');

const performanceLogSchema = new mongoose.Schema({
  endpoint: String,
  source: String, // 'cache' or 'db'
  responseTime: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PerformanceLog', performanceLogSchema);
