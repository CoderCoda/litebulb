module.exports = {
    mongoURI: (process.env.NODE_ENV == "production")?"mongodb://mitchell:mitchym1tch@ds249565.mlab.com:49565/litebulb-prod":"mongodb://localhost/litebulb-dev",
    googleClientID: "939735003009-d0aq0pdrhqsb07ndrb83m0kqasfcijhm.apps.googleusercontent.com",
    googleClientSecret: "_OkhwuTDMUeKfdL7tsjzhZVM"
};