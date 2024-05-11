const request = require('supertest');
const app = require('../index.js');
const { createLocation, calculateDistance, closestDistance } = require('../controllers/location.controller.js');


const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoicm9vdCIsImVtYWlsIjoicm9vdEByb290LmNvbSIsImlkIjoiNjViYWJiNzEzOTllN2E2NWIzODU1YzU2In0sImlhdCI6MTcwNjczNzYxOCwiZXhwIjoxNzA2NzM4NTE4fQ.bx50ztllyEXo141KZ05akynDdEsZRiQZaRt_xIFhfpo";

describe('API Endpoints', () => {
  it('should create a new location', async () => {
    const response = await request(app)
      .post('/api/location')
      .send({ latitude: 27.7749, longitude: -152.4194 })
      .set('Authorization', token);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('latitude', 27.7749);
    expect(response.body.data).toHaveProperty('longitude', -152.4194);
  });

  it('should calculate distance between two coordinates', async () => {
    const response = await request(app)
      .post('/api/distance')
      .send({
        coordinate1: { latitude: 37.7749, longitude: -122.4194 },
        coordinate2: { latitude: 40.7128, longitude: -74.0060 }
      })
      .set('Authorization', token);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('Distance in Meters');
  });

  it('should find the closest location', async () => {
    const response = await request(app)
      .post('/api/closest')
      .send({ latitude: 37.7749, longitude: -122.4194 })
      .set('Authorization', token);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('Location');
  });
});
