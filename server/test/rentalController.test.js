const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../controllers/car rental/carController'); // Import your Express app
const { expect } = chai;

chai.use(chaiHttp);

describe('Car Rental Controller', () => {
  describe('GET /api/rentals/get-all-rentals', () => {
    it('should get all rental cars', async () => {
      const res = await chai.request(server).get('/api/rentals/get-all-rentals');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      // Add more assertions based on your response structure
    });

    // Add more test cases for this route if needed
  });

  describe('GET /api/rentals/get-rental/:id', () => {
    it('should get details of a specific rental car', async () => {
      const res = await chai.request(server).get('/api/rentals/get-rental/1'); // Assuming ID 1 exists

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      // Add more assertions based on your response structure
    });

    it('should return 404 for non-existing rental car', async () => {
      const res = await chai.request(server).get('/api/rentals/get-rental/999'); // Assuming ID 999 doesn't exist

      expect(res).to.have.status(404);
      // Add more assertions as needed
    });
  });

  // Continue with similar test cases for other routes

  describe('PUT /api/rentals/update-viewed', () => {
    it('should update the viewed status of rental cars', async () => {
      const res = await chai.request(server).put('/api/rentals/update-viewed');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      // Add more assertions as needed
    });

    // Add more test cases for this route if needed
  });

  describe('PUT /api/rentals/verified-car-retal/:id', () => {
    it('should update the verification status of a rental car', async () => {
      const res = await chai.request(server).put('/api/rentals/verified-car-retal/1'); // Assuming ID 1 exists

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      // Add more assertions as needed
    });

    it('should return 404 for non-existing rental car', async () => {
      const res = await chai.request(server).put('/api/rentals/verified-car-retal/999'); // Assuming ID 999 doesn't exist

      expect(res).to.have.status(404);
      // Add more assertions as needed
    });
  });

  describe('PUT /api/rentals/publish-all-cars', () => {
    it('should publish all cars', async () => {
      const res = await chai.request(server).put('/api/rentals/publish-all-cars');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      // Add more assertions as needed
    });

    // Add more test cases for this route if needed
  });
});
