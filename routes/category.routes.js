const { verifyingToken } = require('../middlewares/auth.middleware')
category_controller = require('../controller/category.controller')


auth_mw= require('../middlewares/auth.middleware')
module.exports =(app)=> {
    app.post('/ecomm/api/v1/categories',[verifyingToken],category_controller.createNewCategory)

}