import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/user';

dotenv.config();


interface JwtPayload {
  id: number;
  email: string;
}

class AuthService {
  private static readonly jwtSecret = process.env.JWT_SIGN_SECRET!;

  public static generateTokenForUser(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      AuthService.jwtSecret,
      {
        expiresIn: '48h',
      }
    );
  }

  public static parseAuthorization(authorizationHeader: string | null): string | null {
    if (authorizationHeader == null) {
      return null;
    }

    const tokenRegex = /Bearer (.+)/;
    const match = authorizationHeader.match(tokenRegex);
    return match != null ? match[1] : null;
  }

  public static getUserId(authorization: string | null): number {
    let userId = -1;
    const token = AuthService.parseAuthorization(authorization);

    if (token !== null) {
      try {
        const jwtToken = jwt.verify(token, AuthService.jwtSecret) as JwtPayload;
        if (jwtToken !== null) userId = jwtToken.id;
      } catch (err) {
        return userId;
      }
    }

    return userId;
  }
}

export default AuthService;