import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Refresh Token (e2e)', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to refresh a token', async () => {
    await request(app.server).post('/orgs').send({
      name: 'ORG Animals',
      author_name: 'Animal Brown',
      email: 'animal.brown@example.com',
      password: '123456',
      whatsapp: '11 953237408',

      cep: '06530-075',
      state: 'São Paulo',
      city: 'Santana de Parnaíba',
      neighborhood: 'Fazendinha',
      street: 'Rua São paulo',

      latitude: -23.41101,
      longitude: -46.87399,
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'animal.brown@example.com',
      password: '123456',
    })

    const cookies = authResponse.get('Set-Cookie')

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies || [])
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken'),
    ])
  })
})
