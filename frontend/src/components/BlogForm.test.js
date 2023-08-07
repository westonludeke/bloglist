import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BlogForm from './BlogForm';

test('<BlogForm /> calls handleSubmit with the right details when a new blog is created', () => {
  const createBlog = jest.fn();

  render(<BlogForm handleSubmit={createBlog} />);

  const titleInput = screen.getByLabelText('Title:');
  const authorInput = screen.getByLabelText('Author:');
  const urlInput = screen.getByLabelText('URL:');
  const addButton = screen.getByText('Add Blog');

  // Simulate entering values into the form fields
  fireEvent.change(titleInput, { target: { value: 'Test Blog' } });
  fireEvent.change(authorInput, { target: { value: 'Test Author' } });
  fireEvent.change(urlInput, { target: { value: 'http://example.com' } });

  // Simulate submitting the form
  fireEvent.click(addButton);

  // Check if handleSubmit is called with the right details
  expect(createBlog).toHaveBeenCalledTimes(1);
  expect(createBlog).toHaveBeenCalledWith({
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://example.com',
  });
});
