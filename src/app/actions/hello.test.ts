import { hello } from './hello';

it('should return world', async () => {
  const result = await hello();

  expect(result).toBe('world');
});
