const _ = require("lodash");

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return null;
  }

  let favorite = blogs[0];
  let mostLikes = blogs[0].likes;

  for (const blog of blogs) {
    if (blog.likes > mostLikes) {
      favorite = blog;
      mostLikes = blog.likes;
    }
  }
  return favorite;
};

const mostBlogs = (blogs) => {
  const authorBlogCount = _.countBy(blogs, "author");

  const topAuthor = _.maxBy(
    Object.entries(authorBlogCount),
    (authorCount) => authorCount[1]
  );

  console.log(topAuthor, "topAuthor");
  return topAuthor ? { author: topAuthor[0], blogs: topAuthor[1] } : null;
};

const mostLikes = (blogs) => {
  const authorLikeCount = _.reduce(
    blogs,
    (acc, blog) => {
      acc[blog.author] = (acc[blog.author] || 0) + blog.likes;
      return acc;
    },
    {}
  );

  const topAuthor = _.maxBy(
    Object.entries(authorLikeCount),
    (authorLikes) => authorLikes[1]
  );

  return topAuthor ? { author: topAuthor[0], likes: topAuthor[1] } : null;
};

const dummy = (blogs) => {
  return 1;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
