const EventEmitter = require('node:events');
const fs = require('node:fs/promises');
require('dotenv').config();

/**
 * A singleton class extending `EventEmitter` to be instanitated during application start to monitor the specified `logFile`,
 * and trigger a change event upon any modifications.
 */
class LogListener extends EventEmitter {
  constructor() {
    super();
    
    // Absolute path of the `logFile` that is being monitored and read
    this.logFile = process.env.LOG_FILE;

    // Maximum number of lines that can be displayed when a client connects, also the maximum capacity of `logBuffer`
    this.maxLines = process.env.LOG_LINES;

    // Local cache that maintains the most recent `maxLines` that have been read
    this.logBuffer = [];

    // Pointer to the byte postion in the `logFile` read so far
    this.lastByteRead = 0;

    this.init();
  }

  /**
   * Initializes the `LogListener` instance on startup.
   */
  async init() {
    try {
      // Check if file exists.
      await fs.stat(this.logFile);
      // Read the file and load last `maxLines` into `logBuffer`.
      await this.readFile();
      // Start watching the `logFile` for any modifications.
      await this.watch();
    } catch (err) {
      console.error(`Error initializing LogListener, file: ${this.logFile}, error: ${err}`);
    }
  }

  /**
   * Reads the specified `logFile` either at startup or during the watch process. At startup, the `from` and `to` values 
   * are not used. Instead, the entire file is read, and the last `maxLines` configured are loaded into the `logBuffer` 
   * cache. During the watch process, `from` should be set to the position of `lastByteRead` from the previous event loop, 
   * and `to` should be the current file size after any modifications. Note that if the number of lines added to the file 
   * during a watch cycle exceeds the `maxLines` capacity of the `logBuffer` cache, only the first `maxLines` should be 
   * read and loaded into `logBuffer`. If the newly added lines are fewer than `maxLines`, read and load all new lines.
   * @param {*} from Byte postion in the `logFile` indicating where to start reading.
   * @param {*} to Byte postion in the `logFile` indicating where to stop reading.
   */
  async readFile(from = 0, to = Infinity) {
    let fileHandle;
    try {
      fileHandle = await fs.open(this.logFile);
      let newLines = [];

      // Read the newly added lines if any, using stream to reduce memory footprint.
      for await (const line of fileHandle.readLines(from, to))
        // Process the line only if contains some character
        if (line.length > 0) {
          if (newLines.length >= this.maxLines)
            // On startup, load the last `maxLines` of the file
            if (!from && !to) newLines.shift();
            // During a watch cycle, load only the first `maxLines` in case newly added lines exceed `maxLines` capacity 
            else break;
          newLines.push(line);
        }
      
      this.updateProperties(newLines);
    } finally {
      fileHandle?.close();
    }
  }

  /**
   * Monitors the logFile for any alterations. Upon detecting a change event, if there is an increase in file size, 
   * proceeds to read the changes.
   */
  async watch() {
    const watcher = fs.watch(this.logFile);
    for await (const event of watcher) {
      if (event.eventType === 'change') {
        const newSize = (await fs.stat(this.logFile)).size;
        if (newSize > this.lastByteRead)
          await this.readFile(this.lastByteRead, newSize).catch(err => console.error(err));
      }
    }
  }

  /**
   * Updates the `logBuffer` by adding the newly read lines and then triggers an event, notifying listeners of this class 
   * about each new line.
   * @param {*} lines Newly added lines to be updated in the `logBuffer` cache.
   */
  updateProperties(lines) {
    console.log(`Read lines: \n${lines}`);
    lines.forEach(line => {
      if (this.logBuffer.length >= this.maxLines) this.logBuffer.shift();
      this.logBuffer.push(`${line}\n`);
      this.lastByteRead += Buffer.byteLength(line, 'utf-8');
      this.emit('log-event', line);
    });
  }
}

module.exports = new LogListener();