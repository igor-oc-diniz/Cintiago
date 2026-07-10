import { parseCorsOrigins } from './cors-origins.helper';

describe('parseCorsOrigins', () => {
  it('uses the fallback (web + backoffice) when the env var is not set', () => {
    expect(parseCorsOrigins(undefined)).toEqual([
      'http://localhost:5173',
      'http://localhost:5175',
    ]);
  });

  it('parses a comma-separated list, trimming whitespace', () => {
    expect(parseCorsOrigins('http://a.com, http://b.com')).toEqual([
      'http://a.com',
      'http://b.com',
    ]);
  });

  it('works with a single origin', () => {
    expect(parseCorsOrigins('http://a.com')).toEqual(['http://a.com']);
  });
});
