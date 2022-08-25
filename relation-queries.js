const User = require("./models").user;
const Space = require("./models").space;
const Story = require("./models").story;

// Get one user by id, includes his space
async function userWithSpace(id) {
  const responseQuery = await User.findByPk(id, {
    include: [
      {
        model: Space,
        attributes: ["title"],
      },
    ],
  });
  return responseQuery.get({ plain: true });
}

userWithSpace(1).then((user) => console.log("User with space: ", user));

// Get one space by id, includes his stories
async function spaceWithStories(id) {
  const responseQuery = await Space.findByPk(id, {
    include: [
      {
        model: Story,
        attributes: ["name"],
      },
    ],
  });
  return responseQuery.get({ plain: true });
}

spaceWithStories(1).then((space) => console.log("Space with stories: ", space));
