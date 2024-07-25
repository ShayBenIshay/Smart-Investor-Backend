let allowedOrigins;
if (process.env.NODE_ENV == "development") {
  allowedOrigins = ["http://localhost:3000"];
} else {
  allowedOrigins = [
    "https://smart-investor.onrender.com",
    "https://www.smart-investor.onrender.com",
  ];
}

module.exports = allowedOrigins;
