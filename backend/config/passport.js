const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Find or create user based on Google ID
    let user = await prisma.user.findUnique({ where: { googleId: profile.id } });
    if (!user) {
      // If user doesn't exist, create a new one
      user = await prisma.user.create({
        data: {
          googleId: profile.id,
          email: profile.emails[0].value,
        }
      });
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: '/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Find or create user based on GitHub ID
    let user = await prisma.user.findUnique({ where: { githubId: profile.id } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          githubId: profile.id,
          email: profile.emails[0].value,
        }
      });
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

// Serialize and deserialize user (necessary for session-based auth, can be omitted if using JWT only)
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   const user = await prisma.user.findUnique({ where: { id } });
//   done(null, user);
// });
