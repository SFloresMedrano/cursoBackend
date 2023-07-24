import passport from 'passport';
import local from 'passport-local';
import { UserModel } from '../DAO/models/users.model.js';
import { createHash, isValidPassword } from '../utils.js';
import GitHubStrategy from 'passport-github2';
import fetch from 'node-fetch';
import {cartService} from '../services/cartService.js';
import 'dotenv/config';

const LocalStrategy = local.Strategy;

export function iniPassport() {
  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email' },
      async (username, password, done) => {
        try {
          const user = await UserModel.findOne({ email: username });
          if (!user) {
            console.log('User Not Found with username (email) ' + username);
            return done(null, false);
          }
          if (!isValidPassword(password, user.password)) {
            console.log('Invalid Password');
            return done(null, false);
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    'register',
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email',
      },
      async (req, username, password, done) => {
        try {
          const { email, first_name, last_name, age, password } = req.body;
          let user = await UserModel.findOne({ email: username });
          if (user) {
            console.log('User already exists');
            return done(null, false);
          }
          const cart = await cartService.createOne();
          const cartId = cart._id;
          const newUser = {
            email,
            first_name,
            last_name,
            age,
            role: 'user',
            password: createHash(password),
            cart: cartId,
          };
          let userCreated = await UserModel.create(newUser);
          console.log(userCreated);
          console.log('User Registration successful');
          return done(null, userCreated);
        } catch (e) {
          console.log('Error in register');
          console.log(e);
          return done(e);
        }
      }
    )
  );

  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: 'Iv1.a514e444299ce5ad',
        clientSecret: '29f601580b94fbf00dd039e0b68826e316aff26d',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
      },
      async (accesToken, _, profile, done) => {
        try {
          const res = await fetch('https://api.github.com/user/emails', {
            headers: {
              Accept: 'application/vnd.github+json',
              Authorization: 'Bearer ' + accesToken,
              'X-Github-Api-Version': '2022-11-28',
            },
          });
          const emails = await res.json();
          const emailDetail = emails.find((email) => email.verified == true);

          if (!emailDetail) {
            return done(new Error('cannot get a valid email for this user'));
          }
          profile.email = emailDetail.email;

          let user = await UserModel.findOne({ email: profile.email });
          const fullname = profile._json.name.split(' ');
          if (!user) {
            const cart = await cartService.createOne();
            const cartId = cart._id;
            const newUser = {
              email: profile.email,
              first_name: fullname[0] || profile._json.login || 'noname',
              last_name: fullname[fullname.length - 1],
              role: 'user',
              age: '',
              password: 'nopass',
              cart: cartId,
            };
            let userCreated = await UserModel.create(newUser);
            console.log('User Registration successful');
            return done(null, userCreated);
          } else {
            console.log('User already exists');
            return done(null, user);
          }
        } catch (e) {
          console.log('Error en auth github');
          console.log(e);
          return done(e);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById(id);
    done(null, user);
  });
}
