import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup();
  const createBlog = jest.fn();

  render(<BlogForm handleSubmit={createBlog} />);

  const titleInput = screen.getByText('Title:');
  const authorInput = screen.getByText('Author:');
  const urlInput = screen.getByText('URL:');
  const addButton = screen.getByText('Add Blog');

  await user.type(titleInput, 'Sample Blog Title');
  await user.type(authorInput, 'John Doe');
  await user.type(urlInput, 'http://example.com');
  await user.click(addButton);

  // // Manually trigger form submission by clicking the submit button
  const submitButton = screen.getByText('Add Blog');
  userEvent.click(submitButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe('Sample Blog Title');
  expect(createBlog.mock.calls[0][0].author).toBe('John Doe');
  expect(createBlog.mock.calls[0][0].url).toBe('http://example.com');
});
