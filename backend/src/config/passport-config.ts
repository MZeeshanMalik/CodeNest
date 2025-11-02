import axios from "axios";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
// const User = require("../models/userModel");
import User from "../models/userModel";
import dotenv from "dotenv";
import UserTypes from "../utils/types/UserTypes";
import { signtok } from "../controllers/authenticationController";
import { Profile as GitHubProfile } from "passport-github2";

dotenv.config();

interface Email {
  primary: boolean;
  email: string;
}

const fetchGithubEmail = async (
  accessToken: string
): Promise<string | null> => {
  try {
    const res = await axios.get<Email[]>("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const emails = res.data; // Array of emails
    const primaryEmail: string | undefined = emails.find(
      (email: Email) => email.primary
    )?.email;

    return primaryEmail || null; // Return primary email if available
  } catch (error) {
    // console.error("Error fetching emails:", error);
    return null;
  }
};

const generateToken = (user: UserTypes) => {
  //   return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET as string, {
  //     expiresIn: "7d",
  //   });
  return signtok(user._id);
};

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: `${process.env.CALLBACK_URL}/auth/google/callback` as string,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails?.[0].value });
        if (user) {
          return done(null, { user, token: generateToken(user) });
        }
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails?.[0].value,
            name: profile.displayName,
            photo: profile.photos?.[0].value,
          });
        }

        const token = generateToken(user);
        return done(null, { user, token });
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// GitHub OAuth Strategy
interface DoneFunction {
  (error: any, user?: any, info?: any): void;
}

interface GitHubStrategyOptions {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
}

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL: `${process.env.CALLBACK_URL}/auth/github/callback` as string,
    } as GitHubStrategyOptions,
    async (
      accessToken: string,
      refreshToken: string,
      profile: GitHubProfile,
      done: DoneFunction
    ) => {
      let email = profile.emails;

      if (!email) {
        const primaryEmail = await fetchGithubEmail(accessToken);
        email = primaryEmail ? [{ value: primaryEmail }] : undefined;
      }
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email: email || `github_${profile.username}@noemail.com`, // Fallback email
            name: profile.displayName || profile.username || "GitHub User",
            photo: profile.photos?.[0].value,
          });
        }

        const token = generateToken(user);
        return done(null, { user, token });
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;
