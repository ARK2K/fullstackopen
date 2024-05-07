const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0);
};

const dummy = (blogs) => {
  return 1;
};

module.exports = {
  dummy,
  totalLikes,
};
