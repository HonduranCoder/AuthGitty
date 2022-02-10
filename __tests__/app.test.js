const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('backend routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });
  it('should redirect upon login', async () => {
    const req = await request(app).get('/api/v1/users/login');

    expect(req.header.location).toMatch(
      /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&redirect_uri=http:\/\/localhost:7890\/api\/v1\/github\/login\/callback&scope=user/i
    );
  });
  it.skip('should login & redirect to dashboard', async () => {
    const req = await request
      .agent(app)
      .get('/api/v1/github/login/callback?code=42')
      .redirects(1);

    expect(req.body).toEqual({
      id: expect.any(String),
      username: 'fake_login',
      email: 's@s.com',
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });
});
