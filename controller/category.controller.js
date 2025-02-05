//controller for creating catagory
// POST localhost:8881/ecomm/v1/categories

const category_model = require('../models/category.model');

exports.createNewCategory = async (req, res) => {
    try {
        // Validate request body
        if (!req.body.name || !req.body.description) {
            return res.status(400).send({
                message: 'Category name and description are required!',
            });
        }

        // Create category object
        const categoryData = {
            name: req.body.name,
            description: req.body.description,
        };

        // Insert into MongoDB
        const category = await category_model.create(categoryData);

        return res.status(201).send({
            message: 'Category created successfully!',
            category,
        });
    } catch (err) {
        console.error('Error while creating the category:', err);
        return res.status(500).send({
            message: 'Internal server error while creating category',
        });
    }
};


    //return the response of the created category

