import { parseClaims } from './jwt';

describe('jwt utils', () => {
  describe('parseClaims', () => {
    it('should correctly parse a valid JWT token', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      
      const claims = parseClaims(token);
      
      expect(claims).toEqual({
        sub: '1234567890',
        name: 'John Doe',
        iat: 1516239022
      });
    });

    it('should return null for an invalid token', () => {
      const invalidToken = 'invalid.token.here';
      
      const claims = parseClaims(invalidToken);
      
      expect(claims).toBeNull();
    });

    it('should return null for an empty token', () => {
      const emptyToken = '';
      
      const claims = parseClaims(emptyToken);
      
      expect(claims).toBeNull();
    });

    it('should return null for a non-string token', () => {
      const nonStringToken = 123;
      
      const claims = parseClaims(nonStringToken);
      
      expect(claims).toBeNull();
    });
  });
});