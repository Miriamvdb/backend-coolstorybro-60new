const { Router } = require("express");
const Space = require("../models").space;
const Story = require("../models").story;
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

// F2 - GET space by id, include stories - http GET :4000/spaces/1
router.get("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const spaceById = await Space.findByPk(id, { include: [Story] });
    if (spaceById) {
      res.send(spaceById);
    } else {
      res.status(404).send({ message: "Space not found!" });
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
