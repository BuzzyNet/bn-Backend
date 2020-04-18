const config = {
  prod: {
    baseUrl: "/api/v1/",
    dbUrl: "mongodb://localhost:27017/Buzzy_Net",
    host: `https://www.buzzy.io/api/v1/`,
    port: 1000,
  },
  dev: {
    baseUrl: "api/v1/",
    dbUrl: "mongodb://localhost:27017/Buzzy_Net",
    host: `http://localhost:8080/api/v1/`,
    port: 8080,
  },
  test: {
    baseUrl: "/api/v1/",
    dbUrl: "mongodb://localhost:27017/Buzzy_Net",
    port: 2000,
    host: `https://test.buzzy.io/api/v1/`,
  },
};

module.exports = config;
