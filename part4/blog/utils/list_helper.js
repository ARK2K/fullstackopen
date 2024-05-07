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

const dummy = (blogs) => {
  return 1;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
