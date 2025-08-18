const Listing=require("../models/listing.js");
module.exports.filteredByCategory = async (req, res) => {
     console.log("Category filter hit!", req.params.categoryName);
    const { categoryName } = req.params;
    const filteredListings = await Listing.find({ category: categoryName });

    if (filteredListings.length === 0) {
        req.flash("error", `No listings found for category "${categoryName}"`);
        return res.redirect("/listings");
    }

    res.render("listings/index.ejs", { allListings: filteredListings , selectedCategory: categoryName });
};

// module.exports.filteredByLocation=async(req,res)=>{
//     const {locationName}=req.body;
//     console.log(locationName);
//     const filteredListings=await Listing.find({ location: locationName });
//      if (filteredListings.length === 0) {
//         req.flash("error", `No listings found for category "${locationName}"`);
//         return res.redirect("/listings");
//     }
//  res.render("listings/index.ejs", { allListings: filteredListings});   
// }

module.exports.filteredByLocation = async (req, res) => {
  const { locationName } = req.body;
  console.log("Search input:", locationName);

  // Search in both location and country fields
  const filteredListings = await Listing.find({
    $or: [
      { location: { $regex: locationName, $options: "i" } },
      { country: { $regex: locationName, $options: "i" } }
    ]
  });

  if (filteredListings.length === 0) {
    req.flash("error", `No listings found for "${locationName}"`);
    return res.redirect("/listings");
  }

  res.render("listings/index.ejs", {
    allListings: filteredListings,
    searchQuery: locationName
  });
};
