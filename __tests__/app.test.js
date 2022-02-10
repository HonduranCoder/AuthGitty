const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const agent = request.agent(app);
jest.mock('../lib/utils/user.js');

const registerAndLogin = async () => {
  const agent = request.agent(app);
  const user = await agent.get('/api/v1/users/login/callback?code=42');
  return [agent, user];
};

describe('backend routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });
  it('should redirect upon login', async () => {
    const req = await agent.get('/api/v1/users/login');

    expect(req.header.location).toMatch(
      /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&redirect_uri=http:\/\/localhost:7890\/api\/v1\/users\/login\/callback&scope=user/i
    );
  });
  it('should login & redirect to dashboard', async () => {
    const user = await agent
      .get('/api/v1/users/login/callback?code=42')
      .redirects(1);

    expect(user.body).toEqual({
      id: expect.any(String),
      username: 'fake_login',
      email: 's@s.com',
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });
});
