let JwtStrategy = require("passport-jwt").Strategy;
let ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../model").user;

module.exports = (passport) => {
  let opts = {};
  (opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()),
    (opts.secretOrKey = process.env.PASSPORT_SECRET);

  passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
      try {
        let foundUser = await User.findOne({ _id: jwt_payload._id }).exec();
        if (foundUser) {
          return done(null, foundUser); // req.user <= foundUser
        } else {
          return done(null, false);
        }
      } catch (e) {
        return done(e, false);
      }
    })
  );
};
