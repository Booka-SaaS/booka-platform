import request from 'supertest';
import { buildApp } from '../../src/app';

describe('core-api health/security', () => {
  it('returns health status with helmet headers', async () => {
    const response = await request(buildApp()).get('/health').expect(200);

    expect(response.body).toEqual(expect.objectContaining({
      name: 'Booka Backend V2',
      status: 'ok',
    }));
    expect(response.headers['x-content-type-options']).toBe('nosniff');
  });
});
