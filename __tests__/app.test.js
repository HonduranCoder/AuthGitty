const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const agent = request.agent(app);
jest.mock('../lib/utils/user.js');

const mockUser = {
  email: 's@s.com',
  password: '2',
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
  it('logs a user out', async () => {
    const res = await agent.delete('/api/v1/users/sessions').send(mockUser);

    expect(res.body).toEqual({
      success: true,
      message: 'Signed out successfully!',
    });
  });
  it('create a post', async () => {
    await agent.get('/api/v1/users/login/callback?code=42').redirects(1);
    const res = await agent.post('/api/v1/posts').send({
      userId: '1',
      post: 'post',
    });
    expect(res.body).toEqual({
      id: expect.any(String),
      userId: expect.any(String),
      post: expect.any(String),
    });
  });
  it('list posts if signed in', async () => {
    await agent.get('/api/v1/users/login/callback?code=42').redirects(1);
    const post = await agent.post('/api/v1/posts').send({
      post: 'post-it',
    });
    console.log(post, 'GIANT POST');
    const res = await agent.get('/api/v1/posts');
    expect(res.body).toEqual([
      {
        id: post.body.id,
        userId: post.body.userId,
        post: 'post-it',
      },
    ]);
  });
});
