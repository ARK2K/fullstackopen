// src/components/Blog.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi } from "vitest";
import Blog from "./Blog";

describe("<Blog />", () => {
  const blog = {
    title: "Test Blog Title",
    author: "Test Author",
    url: "http://testblog.com",
    likes: 10,
    user: {
      id: "12345",
      name: "Test User",
      username: "testuser",
    },
  };

  const user = {
    username: "testuser",
  };

  test("renders title and author, but not url or likes by default", () => {
    render(
      <Blog
        blog={blog}
        user={user}
        updateBlog={() => {}}
        removeBlog={() => {}}
      />
    );

    // Check if title and author are rendered
    const titleAuthorElement = screen.getByText("Test Blog Title Test Author");
    expect(titleAuthorElement).toBeDefined();

    // Check if url and likes are not rendered by default
    const urlElement = screen.queryByText("http://testblog.com");
    expect(urlElement).toBeNull();

    const likesElement = screen.queryByText("likes: 10");
    expect(likesElement).toBeNull();
  });

  test("shows url and likes when the button is clicked", () => {
    render(
      <Blog
        blog={blog}
        user={user}
        updateBlog={() => {}}
        removeBlog={() => {}}
      />
    );

    const button = screen.getByText("view");
    fireEvent.click(button);

    // Check if url and likes are rendered after clicking the button
    const urlElement = screen.getByText("http://testblog.com");
    expect(urlElement).toBeDefined();

    const likesElement = screen.getByText("likes: 10");
    expect(likesElement).toBeDefined();
  });

  test("calls event handler twice when like button is clicked twice", () => {
    const mockHandler = vi.fn();

    render(
      <Blog
        blog={blog}
        user={user}
        updateBlog={mockHandler}
        removeBlog={() => {}}
      />
    );

    const button = screen.getByText("view");
    fireEvent.click(button);

    const likeButton = screen.getByText("like");
    fireEvent.click(likeButton);
    fireEvent.click(likeButton);

    expect(mockHandler).toHaveBeenCalledTimes(2);
  });
});
