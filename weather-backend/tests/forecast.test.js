// tests/forecast.test.js
const request = require('supertest');
const app = require('../app');
const { sequelize, Location, WeatherData, Favorite } = require('../models');

// Test setup and teardown
beforeAll(async () => {
  // Sync database for tests
  await sequelize.sync({ force: true });
  
  // Seed test data
  const testLocation = await Location.create({
    name: 'TestCity',
    latitude: 10.0,
    longitude: 20.0,
    altitude: 100
  });

  // Create 24 hourly records for test date
  const testDate = '2025-11-19';
  const weatherRecords = [];
  for (let hour = 0; hour < 24; hour++) {
    weatherRecords.push({
      locationId: testLocation.id,
      date: testDate,
      hour: hour,
      tempC: 20 + hour * 0.5,
      condition: 'clear',
      humidity: 60,
      windKph: 10,
      uv: hour >= 6 && hour <= 18 ? 5 : 0
    });
  }
  await WeatherData.bulkCreate(weatherRecords);
});

afterAll(async () => {
  await sequelize.close();
});

describe('Weather Forecast API', () => {
  describe('GET /api/forecast', () => {
    it('should return 200 and forecast data for valid location and date', async () => {
      const response = await request(app)
        .get('/api/forecast')
        .query({ location: 'TestCity', date: '2025-11-19' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('date', '2025-11-19');
      expect(response.body).toHaveProperty('location');
      expect(response.body.location).toHaveProperty('name', 'TestCity');
      expect(response.body).toHaveProperty('hourly');
      expect(response.body.hourly).toHaveLength(24);
      
      // Check first hourly record structure
      const firstHour = response.body.hourly[0];
      expect(firstHour).toHaveProperty('time');
      expect(firstHour).toHaveProperty('hour', 0);
      expect(firstHour).toHaveProperty('tempC');
      expect(firstHour).toHaveProperty('condition');
      expect(firstHour).toHaveProperty('humidity');
      expect(firstHour).toHaveProperty('windKph');
      expect(firstHour).toHaveProperty('uv');
    });

    it('should return 404 for non-existent location', async () => {
      const response = await request(app)
        .get('/api/forecast')
        .query({ location: 'NonExistentCity', date: '2025-11-19' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('message', 'Location not found');
    });

    it('should return 404 for date with no data', async () => {
      const response = await request(app)
        .get('/api/forecast')
        .query({ location: 'TestCity', date: '2025-12-25' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', true);
    });

    it('should return 400 for missing required parameters', async () => {
      const response = await request(app)
        .get('/api/forecast')
        .query({ location: 'TestCity' }); // Missing date

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', true);
    });

    it('should return 400 for invalid date format', async () => {
      const response = await request(app)
        .get('/api/forecast')
        .query({ location: 'TestCity', date: 'invalid-date' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', true);
    });
  });

  describe('GET /api/locations/:id', () => {
    it('should return location by id', async () => {
      const location = await Location.findOne({ where: { name: 'TestCity' } });
      
      const response = await request(app)
        .get(`/api/locations/${location.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', location.id);
      expect(response.body).toHaveProperty('name', 'TestCity');
    });

    it('should return 404 for non-existent location id', async () => {
      const response = await request(app)
        .get('/api/locations/99999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', true);
    });
  });

  describe('POST /api/locations', () => {
    it('should create a new location', async () => {
      const newLocation = {
        name: 'NewCity',
        latitude: 15.5,
        longitude: 25.5,
        altitude: 200
      };

      const response = await request(app)
        .post('/api/locations')
        .send(newLocation);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Location created successfully');
      expect(response.body.location).toHaveProperty('name', 'NewCity');
      expect(response.body.location).toHaveProperty('latitude');
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/locations')
        .send({}); // Missing name

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', true);
    });
  });

  describe('GET /api/favorites', () => {
    it('should return list of favorites', async () => {
      const response = await request(app)
        .get('/api/favorites');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/favorites', () => {
    it('should add location to favorites', async () => {
      const location = await Location.findOne({ where: { name: 'TestCity' } });

      const response = await request(app)
        .post('/api/favorites')
        .send({ locationId: location.id });

      expect([200, 201]).toContain(response.status);
      expect(response.body).toHaveProperty('favorite');
    });

    it('should return 404 for non-existent location', async () => {
      const response = await request(app)
        .post('/api/favorites')
        .send({ locationId: 99999 });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', true);
    });
  });
});
