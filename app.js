const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

require("dotenv").config();

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");

const app = express();
app.use(morgan("dev"));
app.use(
	bodyParser.urlencoded({
		extented: false,
	})
);
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(
	"mongodb+srv://dbAdmin:" +
		process.env.MONGODB_PASSWORD +
		"@shopcluster.dvwp0.mongodb.net/shopdb?retryWrites=true&w=majority"
);

// Handling CORS - We don't need to handle CORS in Postman
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*"); // allowing to all origins
	res.header(
		"Access-Control-Allow-Header",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	if (req.method === "OPTIONS") {
		res.header(
			"Access-Control-Allow-Methods",
			"PUT, POST, DELETE, GET, PATCH"
		);
		return res.status(200), json({});
	}
	next();
});

// Filter Routes with /products, goes with productRoutes
app.use("/products", productRoutes);

// Filter Routes with /orders, goes with productRoutes
app.use("/orders", orderRoutes);

// Handling Errors -> 404 - Not Found
app.use((req, res, next) => {
	const error = new Error("Not Found!");
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message,
		},
	});
});

module.exports = app;
