const { Router } = require("express");
const Space = require("../models").space;
const router = new Router();

// F1 - GET all spaces - http GET :4000/spaces
router.get("/", async (req, res, next) => {
  try {
    const allSpaces = await Space.findAll();
    res.send(allSpaces);
  } catch (e) {
    console.log(e.message);
    next(e);
  }
});

module.exports = router;
