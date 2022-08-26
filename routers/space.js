const { Router } = require("express");
const Space = require("../models").space;
const Story = require("../models").story;
const authMiddleware = require("../auth/middleware");
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

// F4 DELETE story - http DELETE :4000/spaces/1/stories/2 Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY2MTUxMzY5OSwiZXhwIjoxNjYxNTIwODk5fQ.dwTJBOK7ztqrsyw37Rw226puaD1Nf5ecdTAWr8Elx_4"
router.delete(
  "/:spaceId/stories/:storyId",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { spaceId, storyId } = req.params;
      const story = await Story.findByPk(storyId, { include: [Space] });
      if (!story) {
        return res.status(404).send("Story not found");
      }

      // Check if this user is the owner of the space
      if (story.space.userId !== req.user.id) {
        return res
          .status(401)
          .send("You're not authorized to delete this story");
      }

      await story.destroy();

      res.send({ message: "Story deleted", storyId });
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
