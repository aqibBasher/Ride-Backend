const timezone = 3;
const swaggerUi = require('swagger-ui-express');
const express = require('express');
const YAML = require('yamljs');
const http = require('http');
const Ably = require('ably');

const { errorHandler } = require('./middlewares/error');
const { xrideBusinessBasicAuth } = require('./middlewares/xrideBusinessBasicAuth');
const { xrideBasicAuth } = require('./middlewares/xrideBasicAuth');
const cors = require('cors');
require('./database/connection');
require('dotenv').config();
require('colors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// run app in nginx with proxy
app.set('trust proxy', true);

const mysql = require('mysql2');

const specs = require('./config/swaggerConfig');

const server = http.createServer(app);

// Load Swagger YAML file
const swaggerDocument = YAML.load(__dirname + '/swagger.yaml');

// Serve Swagger UI documentation from /api-docs route
app.use('/docs', xrideBasicAuth, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
 
// Web App Administration API's
app.use('/api/v1/administration/cars', require('./routes/administration/carRoutes'));
app.use('/api/v1/administration/auth', require('./routes/administration/authRoutes'));
app.use('/api/v1/administration/users', require('./routes/administration/userRoutes'));
// app.use('/api/v1/administration/seasons', require('./routes/administration/seasonRoutes'));
app.use('/api/v1/administration/car-reviews', require('./routes/administration/carRoutes'));
app.use('/api/v1/administration/bookings', require('./routes/administration/bookingRoutes'));
app.use('/api/v1/administration/categories', require('./routes/administration/categoryRoutes'));
app.use('/api/v1/administration/car-rentals', require('./routes/administration/carRentalRoutes'));
app.use('/api/v1/administration/user-reviews', require('./routes/administration/userReviewRoutes'));
app.use('/api/v1/administration/support-contacts', require('./routes/administration/supportContactRoutes'));
app.use('/api/v1/administration/car-rental-reviews', require('./routes/administration/carRentalReviewRoutes'));
app.use('/api/v1/administration/car-rental-api', require('./routes/administration/apis/apisRoutes'));

// Web App Xride Busniess API's
app.use('/api/v1/car-rental/cars', require('./routes/car rental/carRoutes'));
app.use('/api/v1/car-rental/auth', require('./routes/car rental/authRoutes'));
app.use('/api/v1/car-rental/rates', require('./routes/car rental/rateRoutes'));
app.use('/api/v1/car-rental/bookings', require('./routes/car rental/bookingRoutes'));
app.use('/api/v1/car-rental/car', require('./routes/car rental/carRoutes'));
app.use('/api/v1/car-rental/chat-messages', require('./routes/car rental/messageRoutes'));


app.use('/api/v1/webservice/xride-business/auth', xrideBusinessBasicAuth, require('./routes/webservices/xride-business/authRoutes'));
app.use('/api/v1/webservice/xride-business/bookings', xrideBusinessBasicAuth, require('./routes/webservices/xride-business/bookingRoutes'));
app.use('/api/v1/webservice/xride-business/chats', xrideBusinessBasicAuth, require('./routes/webservices/xride-business/chatRoutes'));

app.use('/api/v1/webservice/xride/auth', xrideBasicAuth, require('./routes/webservices/xride/authRoutes'));
app.use('/api/v1/webservice/xride/categories', xrideBasicAuth, require('./routes/webservices/xride/categoryRoutes'));


app.use('/api/v1/connection',xrideBasicAuth, require('./routes/database/connectionRoute'))
app.use(errorHandler);

const port = process.env.PORT || 3001;
server.listen(3001, () => console.log(`Server is running on port 3001`));