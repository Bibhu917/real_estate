const express = require("express");
const listingRouter = express.Router();
const jwt = require("jsonwebtoken");
const listingModel = require("../models/listiingmodel");

listingRouter.post("/create", async (req, res) => {
  try {
    const token = req.cookies.access_token;
    console.log(token);

    if (!token) {
      return res.status(401).send({ success: false, message: "Unauthorized" });
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
      if (err) {
        console.error("Token Verification Error:", err);
        return res.status(403).send({ success: false, message: "Forbidden" });
      }
      try {
        const listing = new listingModel({ ...req.body });
        await listing.save();
        return res.status(201).send({
          success: true,
          message: "Listing Created Successfully",
          listing,
        });
      } catch (error) {
        console.log(error);
        return res.status(500).send({
          success: false,
          message:
            "Internal Server Erro occur while ftching create listig route api",
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      messgae:
        "Internal Server Erro occur while ftching create listig route api",
    });
  }
});
listingRouter.get("/list/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await listingModel.find({ userRef: id });

    if (!listing) {
      return res
        .status(404)
        .send({ success: false, message: "Listings not found" });
    }

    res
      .status(200)
      .send({ success: true, message: "Listings found:", listing });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Server error" });
  }
});
listingRouter.delete("/deletelist/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await listingModel.findByIdAndDelete(id);
    if (!listing) {
      return res
        .status(404)
        .send({ success: false, message: "Listing Not Found" });
    }
    return res.status(200).send({
      success: true,
      message: "Listing Deleted Successfully",
      listing,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error", error });
  }
});

listingRouter.put("/updatelist/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const listingdata = req.body;
    const listing = await listingModel.findByIdAndUpdate(id, listingdata, {
      new: true,
    });
    if (!listing) {
      return res
        .status(404)
        .send({ success: false, message: "List not found" });
    }
    return res
      .status(200)
      .send({ success: true, message: "List Update successfully", listing });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
  }
});

module.exports = listingRouter;
