const Product = require("../models/productModel")
const ErrorHandler = require("../utils/errorHandlers")
const catchAsyncError = require("../middleware/catchAsyncError")
const Apifeature = require("../utils/apifeature")

exports.getAllProduct =  catchAsyncError( async (req,res,next)=>{
  const resultPerPage = 5;
  const productCount = await Product.count();
 const apifeature = new Apifeature(Product.find(),req.query).search().filter().pagination(resultPerPage);
        const products = await apifeature.query;
        res.status(200).json({
        sucess: true,
        message:products
    });
})

///create product -- Admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: product,
    });
  });

//update product -- Admin
exports.updateProduct = catchAsyncError(async (req, res,next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
       return next(new ErrorHandler("Product not found",500))
    }
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true, useFindAndModify: false }
    );
    res.status(201).json({
        success: true,
        message: "Product updated successfully",
        product: updatedProduct
    });
})

//delete product by -- admin
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }
      await product.deleteOne();
      res.status(200).json({
        success: true,
        message: "Product deleted successfully"
      });
    } catch (err) {
      next(new ErrorHandler("An error occurred while deleting the product", 500));
    }
  });
  
  // get product details 
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }
        res.status(200).json({
            success: true,
            message: product
        });
}
)

////reviews
exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
console.log(req.user)
  const product = await Product.findById(productId);
console.log(req.user._id)

  const review = {
    user: req.user.id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
console.log(review);


  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});


exports.getProductReviews = catchAsyncError(async (req, res, next) => {

  
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});


exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);


  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  console.log(reviews)
  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});