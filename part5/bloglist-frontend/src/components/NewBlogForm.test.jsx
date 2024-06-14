import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi } from "vitest";
import NewBlogForm from "./NewBlogForm";

describe("<NewBlogForm />", () => {
  test("calls the event handler with the right details when a new blog is created", () => {
    const createBlog = vi.fn();

    render(<NewBlogForm createBlog={createBlog} />);

    const titleInput = screen.getByLabelText("Title:");
    const authorInput = screen.getByLabelText("Author:");
    const urlInput = screen.getByLabelText("URL:");
    const createButton = screen.getByText("Create");

    fireEvent.change(titleInput, { target: { value: "Test Title" } });
    fireEvent.change(authorInput, { target: { value: "Test Author" } });
    fireEvent.change(urlInput, { target: { value: "http://testurl.com" } });
    fireEvent.click(createButton);

    expect(createBlog).toHaveBeenCalledWith({
      title: "Test Title",
      author: "Test Author",
      url: "http://testurl.com",
    });
    expect(createBlog).toHaveBeenCalledTimes(1);
  });
});
