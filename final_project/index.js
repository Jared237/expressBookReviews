const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({secret:"fingerprint_customer", resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if user is logged in and has a valid session
    if (req.session.authorization) {
        // Get the token from session
        let token = req.session.authorization['accessToken'];
        
        // Verify JWT token
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                // Token is valid, store user info and proceed
                req.user = user;
                next();
            } else {
                // Token is invalid
                return res.status(403).json({message: "User not authenticated. Invalid token."});
            }
        });
    } else {
        // No session or token found
        return res.status(403).json({message: "User not logged in. Please login first."});
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running on port " + PORT));
