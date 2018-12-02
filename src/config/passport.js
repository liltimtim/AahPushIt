const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const keys = require("../config/keys");
const Installation = require("../models/Installation");
let opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.SECRET_KEY;

module.exports = passport => {
  passport.use(
    new JWTStrategy(opts, async (payload, done) => {
      const { applicationId, installationId } = payload;
      if (!applicationId || !installationId) {
        return done(null, false);
      }
      let installation = await Installation.findById(installationId);
      if (!installation) {
        return done(null, false);
      }
      return done(null, installation);
    })
  );
};
