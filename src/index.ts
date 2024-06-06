import express from "express";
import session from "express-session";
import passport, { Profile } from "passport";
import DiscordStrategy from "passport-discord";
import env from "dotenv";

env.config();

const app = express();
const port: number = parseInt(process.env.PORT!);

const CLIENT_ID: string = process.env.CLIENT_ID!;
const CLIENT_SECRET: string = process.env.CLIENT_SECRET!;
const CALLBACK_URI: string = process.env.CALLBACK_URI!;
const COOKIE_SECRET: string = process.env.COOKIE_SECRET!;

passport.serializeUser((user: Express.User, done) => {
    done(null, user);
});

passport.deserializeUser((obj: Express.User, done) => {
    done(null, obj);
});

passport.use(new DiscordStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: CALLBACK_URI,
    scope: ['identify', 'guilds']
}, (accessToken: string, refreshToken: string, profile: DiscordStrategy.Profile, done) => {
    process.nextTick(() => {
        return done(null, profile);
    });
}));

app.use(session({
    secret: COOKIE_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/login", passport.authenticate("discord"));

app.get("/callback", 
    passport.authenticate("discord", { failureRedirect: "/" }),
    (req, res) => {
        res.redirect("/dashboard");
    }
);

app.get("/dashboard", (req, res) => {
    if (!req.isAuthenticated()) return res.redirect("/login");
    res.send(`<h1>Dashboard</h1><p>Hello, ${(req.user as Profile).username}</p><p><a href="/logout">Logout</a></p>`);
});

app.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.get('/', (req, res) => {
    res.send('<h1>Home</h1><p><a href="/login">Login with Discord</a></p>');
});
  
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});