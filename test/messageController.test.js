// test/messageController.test.js

const assert = require('assert'); // Using Node.js built-in assert module
const {
  getMessages,
  saveMessage,
  createRoom,
  seenMessage,
  getRoom,
  getRooms,
} = require('../server/controllers/car rental/messageController.js'); // Update the path accordingly

describe('MessageController Functions', () => {
  it('getMessages should return an array of messages', async () => {
    const req = { body: { room_id: 1 } }; // Mock the request object
    const res = {
      status: (code) => {
        assert.strictEqual(code, 200); // Ensure status code is 200
        return res; // Return the response object for chaining
      },
      json: (data) => {
        assert(Array.isArray(data)); // Ensure the response is an array
      },
    };
    await getMessages(req, res);
  });

  it('saveMessage should create and return a new message', async () => {
    // Similar structure to the previous test
  });

  it('createRoom should create and return a new room', async () => {
    // Similar structure to the previous test
  });

  it('seenMessage should update the status of messages', async () => {
    // Similar structure to the previous test
  });

  it('getRoom should return a single room', async () => {
    // Similar structure to the previous test
  });

  it('getRooms should return an array of rooms', async () => {
    // Similar structure to the previous test
  });
});
