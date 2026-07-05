import test from 'node:test';
import assert from 'node:assert/strict';

test('prisma module does not crash at import time without DATABASE_URL', async () => {
  delete process.env.DATABASE_URL;

  const prismaModule = await import('./prisma');

  assert.ok(prismaModule.default);
});
