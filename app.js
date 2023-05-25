const express = require("express");
const db = require('./connection')
const app = express();
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
dotenv.config({ path: './.env' })
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRETKEY;
const bcrypt = require('bcrypt');


//connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("Connection done");
});

app.use(bodyParser.json());

app.use('/api', authenticateToken, require('./routes/api'))
app.use('/application', authenticateToken, require('./routes/application'))
app.use('/external', authenticateToken, require('./routes/externalapi'))




// Sign up route
app.post('/signup', (req, res) => {
    const { username, password, phone, email, role } = req.body;

    // Hash the password
    bcrypt.hash(password, 10, (error, hashedPassword) => {
        if (error) {
            console.error('Error occurred during password hashing:', error);
            res.status(500).json({ message: 'Sign up failed.' });
        } else {
            const data = [username, hashedPassword, phone, email, role];

            db.query('INSERT INTO applicants (username, password, phone, email, role) VALUES (?,?,?,?,?)', data, (error, results) => {
                if (error) {
                    console.error('Error occurred during sign up:', error);
                    res.status(500).json({ message: 'Sign up failed.' });
                } else {
                    res.status(200).json({ message: 'Sign up successful.' });
                }
            });
        }
    });
});


// Sign in route
app.post('/signin', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM applicants WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error occurred during sign in:', error);
            res.status(500).json({ message: 'Sign in failed.' });
        } else if (results.length === 0) {
            res.status(401).json({ message: 'Invalid credentials.' });
        } else {
            const user = results[0];

            // Compare the provided password with the hashed password
            bcrypt.compare(password, user.password, (error, isMatch) => {
                if (error) {
                    console.error('Error occurred during password comparison:', error);
                    res.status(500).json({ message: 'Sign in failed.' });
                } else if (!isMatch) {
                    res.status(401).json({ message: 'Invalid credentials.' });
                } else {
                    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, secretKey, { expiresIn: '1h' });

                    res.status(200).json({ message: 'Sign in successful.', token });
                }
            });
        }
    });
});


function authenticateToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    const tokenValue = token.split(' ')[1];

    jwt.verify(tokenValue, secretKey, (error, decoded) => {
        if (error) {
            return res.status(403).json({ message: 'Failed to authenticate token.' });
        }

        req.user = decoded;
        next();
    });
}


app.listen("3000", () => {
    console.log("Server is successfully running on port 3000");
});