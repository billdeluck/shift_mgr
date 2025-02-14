import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token' });
            }

            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ message: 'Authentication required' });
    }
};

// Define proxy routes
const routes = [
    {
        path: '/api/auth',
        target: process.env.AUTH_SERVICE_URL,
        authenticate: false // No authentication needed for auth service
    },
    {
        path: '/api/users',
        target: process.env.USER_SERVICE_URL,
        authenticate: true
    },
    {
        path: '/api/shifts',
        target: process.env.SHIFT_SERVICE_URL,
        authenticate: true
    },
    {
        path: '/api/reports',
        target: process.env.REPORT_SERVICE_URL,
        authenticate: true
    },
    {
        path: '/api/notifications',
        target: process.env.NOTIFICATION_SERVICE_URL,
        authenticate: true
    },
    {
        path: '/api/events',
        target: process.env.EVENT_SERVICE_URL,
        authenticate: true
    }
];

routes.forEach(route => {
    app.use(route.path, (req, res, next) => {
            // Authentication logic
            if (route.authenticate) {
                const authHeader = req.headers.authorization;
                if (authHeader) {
                    const token = authHeader.split(' ')[1];
                    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
                        if (err) {
                            return res.status(403).json({ message: 'Invalid token' });
                        }
                        req.user = user;
                        createProxyMiddleware({
                            target: route.target,
                            changeOrigin: true,
                            pathRewrite: {
                                [`^${route.path}`]: '',
                            },
                            onProxyRes: (proxyRes, req, res) => {
                                console.log('✅ Proxy request to', route.target, 'with status', proxyRes.statusCode);
                            },
                            onError: (err, req, res) => {
                                console.error('❌ Proxy error:', err);
                                res.status(500).json({ message: 'Proxy error', error: err });
                            }
                        })(req, res, next);
                    });
                } else {
                    res.status(401).json({ message: 'Authentication required' });
                }
            }
        else{
            createProxyMiddleware({
                target: route.target,
                changeOrigin: true,
                pathRewrite: {
                    [`^${route.path}`]: '',
                },
                onProxyRes: (proxyRes, req, res) => {
                    console.log('✅ Proxy request to', route.target, 'with status', proxyRes.statusCode);
                },
                onError: (err, req, res) => {
                    console.error('❌ Proxy error:', err);
                    res.status(500).json({ message: 'Proxy error', error: err });
                }
            })(req, res, next);
        }
        },

    );
});

app.get('/', (req, res) => {
    res.send('API Gateway is running!');
});

app.listen(port, () => {
    console.log(`✅ API Gateway listening on port ${port}`);
});