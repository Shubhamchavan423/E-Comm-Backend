const authController = require('../controller/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');


module.exports = (app) => {
    app.post('/ecomm/api/v1/auth/signup',[authMiddleware.verifySignupBody] ,authController.signup); 

    //route for post call
    app.post('/ecomm/api/v1/auth/signin',[authMiddleware.signInBody, authMiddleware.isAdminCheck],authController.signin);

    
};

