import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Blog from './Blog';

test('renders content', () => {
  const blog = {
    title: 'Sample Blog Title',
    author: 'John Doe',
    url: 'http://example.com',
    likes: 5
  };

  render(<Blog blog={blog} />);

  const titleElement = screen.getByText('Sample Blog Title');
  const authorElement = screen.getByText(/by: John Doe/);
  const urlElement = screen.getByText('http://example.com');
  const likesElement = screen.getByText(/Likes: 5/);

  expect(titleElement).toBeDefined();
  expect(authorElement).toBeDefined();
  expect(urlElement).toBeDefined();
  expect(likesElement).toBeDefined();
});

test('clicking the delete button calls event handler once', async () => {
  const blog = {
    id: 123,
    title: 'Sample Blog Title',
    author: 'John Doe',
    url: 'http://example.com',
    likes: 5
  };

  const mockHandler = jest.fn();

  render(<Blog blog={blog} user={{ username: 'testuser' }} handleDelete={mockHandler} />);

  const user = userEvent.setup();
  const deleteButton = screen.getByText('delete');
  await user.click(deleteButton);

  expect(mockHandler.mock.calls).toHaveLength(1);
});
