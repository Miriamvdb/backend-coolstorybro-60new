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

// F5: POST a new story to space with corresponding id
// Try without authMiddleware first !!!
// http POST :4000/spaces/1/stories Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY2MTUyMzIwNiwiZXhwIjoxNjYxNTMwNDA2fQ.eEvHM5r1pjEyVyZck2_LLFFJnBc9j1go28tjkrKs-b0" name="Spongebob & Miriam Story" content="Some fake text to create a story about Spongebob, im in feature 5 now, Groetjes Miriam" imageUrl="https://sm.ign.com/ign_nl/news/n/nickelodeo/nickelodeon-announces-spongebob-squarepants-prequel-series-a_zeuq.jpg"
router.post("/:id/stories", authMiddleware, async (req, res) => {
  const space = await Space.findByPk(req.params.id);
  console.log(space);

  if (space === null) {
    return res.status(404).send({ message: "This space does not exist" });
  }

  if (!space.userId === req.user.id) {
    return res
      .status(403)
      .send({ message: "You are not authorized to update this space" });
  }

  const { name, imageUrl, content } = req.body;

  if (!name) {
    return res.status(400).send({ message: "A story must have a name" });
  }

  const story = await Story.create({
    name,
    imageUrl,
    content,
    spaceId: space.id,
  });

  return res.status(201).send({ message: "New story created", story });
});

// F6: UPDATE space with corresponding id - http PATCH :4000/spaces/1 Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY2MTYyOTc0MCwiZXhwIjoxNjYxNjM2OTQwfQ.bGSxdLlVosDsGO3Z1AVs-DLqMivwUmxuJNRQP_yvw1M" title="Aardbei Space" description="A space about aardbeien" backgroundColor="#fac0db" color="#6b1a40"
router.patch("/:id", authMiddleware, async (req, res) => {
  const space = await Space.findByPk(req.params.id);
  if (!space.userId === req.user.id) {
    return res
      .status(403)
      .send({ message: "You are not authorized to update this space" });
  }

  const { title, description, backgroundColor, color } = req.body;

  await space.update({ title, description, backgroundColor, color });

  return res.status(200).send({ space });
});

module.exports = router;
