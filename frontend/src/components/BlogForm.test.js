import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BlogForm from './BlogForm';

test('<BlogForm /> calls handleSubmit with the right details when a new blog is created', () => {
  // Create a mock function for the handleSubmit event handler
  const handleSubmit = jest.fn();

  // Render the BlogForm component with the mock handleSubmit function
  render(
    <BlogForm
      title=""
      author=""
      url=""
      handleSubmit={handleSubmit}
      handleTitleChange={() => {}}
      handleAuthorChange={() => {}}
      handleUrlChange={() => {}}
    />
  );

  // Get form elements
  const titleInput = screen.getByLabelText('Title:');
  const authorInput = screen.getByLabelText('Author:');
  const urlInput = screen.getByLabelText('URL:');
  const addButton = screen.getByText('Add Blog');

  // Simulate user interactions by typing values and clicking the Add Blog button
  fireEvent.change(titleInput, { target: { value: 'Test Blog' } });
  fireEvent.change(authorInput, { target: { value: 'Test Author' } });
  fireEvent.change(urlInput, { target: { value: 'http://example.com' } });
  fireEvent.click(addButton);

  // Check if handleSubmit is called with the right details
  expect(handleSubmit).toHaveBeenCalledTimes(1);
  expect(handleSubmit).toHaveBeenCalledWith({
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://example.com',
  });
});
