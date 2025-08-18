

const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
// const {listingSchema, reviewSchema} = require('../schema.js');
// const ExpressError = require('../utils/ExpressError.js');
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const filterListingController = require("../controllers/filterlistings.js");
const upload = multer({ storage })

  // in routes/listings.js
router.get("/category/:categoryName", wrapAsync(filterListingController.filteredByCategory));
// Search by location
router.post("/search", wrapAsync(filterListingController.filteredByLocation));

router
  .route('/')
  .get( wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single('listing[image]'), 
    validateListing,
    wrapAsync(listingController.createListing)
  );


 
//New Route
router.get("/new", isLoggedIn,listingController.renderNewForm );

router
.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner,
  upload.single('listing[image]'), 
   validateListing,wrapAsync( listingController.updateListing))
.delete(isLoggedIn, isOwner,wrapAsync(listingController.destroyListing)
);


//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,  wrapAsync(listingController.renderEditForm));




module.exports = router;
