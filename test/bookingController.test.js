// test/backend.test.js

const assert = require('assert'); // Using Node.js built-in assert module
const {
  getAllBookings,
  getAllBookingsHistory,
  getOneBooking,
  getBooking,
} = require('../server/controllers/car rental/bookingController.js'); // Update the path accordingly

describe('Backend Functions', () => {
  it('getAllBookings should return an array of bookings', async () => {
    const req = {}; // Mock the request object
    const res = {
      status: (code) => {
        assert.strictEqual(code, 200); // Ensure status code is 200
        return res; // Return the response object for chaining
      },
      json: (data) => {
        assert(Array.isArray(data)); // Ensure the response is an array
      },
    };
    await getAllBookings(req, res);
  });

  it('getAllBookingsHistory should return an array of bookings', async () => {
    // Similar structure to the previous test
  });

  it('getOneBooking should return a single booking', async () => {
    // Similar structure to the previous test
  });

  it('getBooking should return a single booking', async () => {
    // Similar structure to the previous test
  });
});
