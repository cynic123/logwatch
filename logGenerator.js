const fs = require('node:fs/promises');
const rs = require('random-sentence');
require('dotenv').config();

// Path to `logFile`
const logFile = process.env.LOG_FILE;

// Interval in milliseconds for appending new entries to `logFile`
const interval = 5000;

/** Append to `logFile` with random number of lines, each with timestamp and random words, to simulate a dynamic prod 
 * enviroment */
const appendFile = async () => {
  const noOfSentences = Math.floor(Math.random() * 10) + 1;
  for (let i = 0; i < noOfSentences; i++) {
    const dateStr = new Date().toISOString();
    const random = rs({ min: 10, max: 100 });
    await fs.appendFile(logFile, `${dateStr}: ${random}\n`);
  }
}

// Start writing to `logFile`
const writeLog = () => {
  setInterval(async () => await appendFile(), interval);
}

module.exports = writeLog();
