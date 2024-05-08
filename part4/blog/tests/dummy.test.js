const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const _ = require("lodash");

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
      __v: 0,
    },
  ];
  const blogsEmpty = [];

  const blogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0,
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0,
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0,
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0,
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0,
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0,
    },
  ];

  test("of empty list is zero", () => {
    const result = listHelper.totalLikes(blogsEmpty);
    assert.strictEqual(result, 0);
  });

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("of a bigger list is calculated right", () => {
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 36);
  });
});

describe("favorite blog", () => {
  test("of an empty list is none", () => {
    const blogs = [];

    const result = listHelper.favoriteBlog(blogs);
    assert.strictEqual(result, null);
  });

  test("of a single blog is the only blog", () => {
    const blogs = [
      {
        title: "Only Blog",
        author: "John Doe",
        likes: 10,
      },
    ];

    const result = listHelper.favoriteBlog(blogs);
    assert.deepStrictEqual(result, blogs[0]);
  });

  test("with many blogs picks the one with most likes", () => {
    const blogs = [
      { title: "First Blog", author: "Jane Doe", likes: 5 },
      { title: "Second Blog", author: "John Doe", likes: 8 },
      { title: "Third Blog", author: "Pete Doe", likes: 7 },
    ];

    const expectedFavorite = {
      title: "Second Blog",
      author: "John Doe",
      likes: 8,
    };

    const result = listHelper.favoriteBlog(blogs);
    assert.deepStrictEqual(result, expectedFavorite);
  });
});

describe("most blogs", () => {
  const blogs = [
    { _id: "...", title: "...", author: "Robert C. Martin", likes: 10 },
    { _id: "...", title: "...", author: "Edsger W. Dijkstra", likes: 5 },
    { _id: "...", title: "...", author: "Robert C. Martin", likes: 7 },
  ];

  test("returns author with the most blogs", () => {
    const result = listHelper.mostBlogs(blogs);
    assert.deepStrictEqual(result, { author: "Robert C. Martin", blogs: 2 });
  });

  test("when list is empty, returns null", () => {
    const emptyList = [];
    const result = listHelper.mostBlogs(emptyList);
    assert.strictEqual(result, null);
  });

  test("when multiple authors have the same most blogs, returns one of them", () => {
    const tiedBlogs = [
      { likes: 10, author: "John Doe" },
      { likes: 5, author: "Jane Doe" },
      { likes: 10, author: "John Doe" },
    ];

    const result = listHelper.mostBlogs(tiedBlogs);
    assert.strictEqual(result.blogs, 2);
    assert(typeof result.author === "string");
  });
});
