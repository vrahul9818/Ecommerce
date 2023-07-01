const express = require("express");
const router =  express.Router();

const {getAllProduct, createProduct, updateProduct, deleteProduct, getProductDetails,createProductReview,getProductReviews,deleteReview} = require("../controllers/productionController"); 
const { isAuthenticatedUser ,authorizeRoles} = require("../middleware/auth");
router.route("/product").get(getAllProduct);
router.route("/create").post(isAuthenticatedUser,authorizeRoles("admin"),createProduct);
router.route("/product/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateProduct);
router.route("/product/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct).get(getProductDetails)

router.route("/review").put(isAuthenticatedUser,createProductReview)
router.route("/reviews").get(getProductReviews)


router.route("/reviews").delete(isAuthenticatedUser,deleteReview)



module.exports = router