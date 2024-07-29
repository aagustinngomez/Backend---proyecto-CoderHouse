import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import UserManagerDao from "../dao/managers/userManager.manager.js";
import config from "../config/config.js";
import { cookieExtractor } from "../utils/jwt.js";
import { AvailableRoles } from "../constant/role.js";
import { ClientError } from "../utils/ClientError.js";
import { ErrorCode } from "../utils/ErrorCode.js";

const { GITHUB_CLIENT_ID, GITHUB_SECRET, GITHUB_CALLBACK_URL, SIGNING_SECRET, API_URL } = config;

const initializePassport = () => {
  const userManager = new UserManagerDao();

  passport.use(
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_SECRET,
        callbackURL: GITHUB_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile._json.email || profile._json.login;
          let user = await userManager.getUserByEmail(email);

          if (!user) {
            user = await userManager.createUser({
              email: email,
              firstName: profile._json.name,
              lastName: "",
              password: "",
              age: 0,
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: SIGNING_SECRET,
        audience: API_URL,
      },
      async (jwtPayload, done) => {
        try {
          const { user } = jwtPayload;

          if (!user || !user.email || !user.role) {
            throw new ClientError(
              "passport",
              ErrorCode.BAD_PARAMETERS,
              400,
              "bad request structure",
              "The payload needs to include user with an email and role"
            );
          }

          const userData = await userManager.getUserByEmail(user.email);

          if (userData && AvailableRoles.includes(user.role)) {
            return done(null, userData);
          }

          return done(null, false);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (serUser, done) => {
    const user = await userManager.getUserByEmail(serUser.email);
    done(null, user);
  });
};
console.log(config);  // Añade esto justo después de importar el config
export default initializePassport;