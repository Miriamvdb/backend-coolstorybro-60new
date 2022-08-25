"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "spaces",
      [
        {
          title: "Apple Space",
          description: "This Apple Space is about apples",
          backgroundColor: "#fcc7bd",
          color: "#fa2802",
          createdAt: new Date(),
          updatedAt: new Date(),
          // userId: 1,
        },
        {
          title: "Banana Space",
          description: "This Banana Space is about bananas",
          backgroundColor: "#fcebc2",
          color: "#f7ad00",
          createdAt: new Date(),
          updatedAt: new Date(),
          // userId: 2,
        },
        {
          title: "Coconut Space",
          description: "This Coconut Space is about coconuts",
          backgroundColor: "#c2ecfc",
          color: "#048fc4",
          createdAt: new Date(),
          updatedAt: new Date(),
          // userId: 3,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("spaces", null, {});
  },
};
