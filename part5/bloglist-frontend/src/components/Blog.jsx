import { useState } from "react";

const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>{showDetails ? "Hide" : "View"}</button>
      </div>
      {showDetails && (
        <div>
          <p>{blog.url}</p>
          <p>likes: {blog.likes}</p>
          <p>{blog.user.name}</p>
          <button>Like</button>
        </div>
      )}
    </div>
  );
};

export default Blog;
