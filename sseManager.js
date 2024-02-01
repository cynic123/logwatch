/**
 * Manages the SSE (Server-Sent Events) connection with clients and monitors updates from LogListener. When an event 
 * update occurs, sends the client the newly added lines read.
 */

const listener = require('./logListener');
const uuid = require('uuid');

// Map to maintain an entry of each client and its response
const subscribers = new Map();

module.exports = (req, res, next) => {
  // Send specific headers to client in order to establish a Server-Sent Events (SSE) connection
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  });

  /**
   * Generate a unique identifier by combining a random UUID with the current timestamp, and add this as an entry to the 
   * subscribers map
   */
  const subscriberId = uuid.v4() + '-' + Date.now();
  subscribers.set(subscriberId, { response: res });

  // Declare a listener for the log event, which writes to the response of the client
  const onLogEvent = (data) => {
    const subscriber = subscribers.get(subscriberId);
    if (subscriber) subscriber.response.write(`data: ${data}\n\n`);
  }
  // Add the listener to the LogListener instance
  listener.addListener('log-event', onLogEvent);

  // On disconnect from the client, remove the client entry from the `subscribers` map
  req.on('close', () => {
    console.log(`Connection closed for ${subscriberId}`);
    subscribers.delete(subscriberId);
  });
}