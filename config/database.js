if (process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb://mitchell:mitchym1tch@ds249565.mlab.com:49565/litebulb-prod"}
} else {
    module.exports = {mongoURI: "mongodb://localhost/litebulb-dev"}
}