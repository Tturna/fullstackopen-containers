import { render, fireEvent, screen } from '@testing-library/react';
import Todo from './Todo';

test('renders the todo text', () => {
  const todo = { text: 'Test Todo', done: false };
  render(<Todo todo={todo} />);
  expect(screen.getByText('Test Todo')).toBeInTheDocument();
});

test('renders the not done info when todo is not done', () => {
  const todo = { text: 'Test Todo', done: false };
  render(<Todo todo={todo} />);
  expect(screen.getByText('This todo is not done')).toBeInTheDocument();
});

test('renders the done info when todo is done', () => {
  const todo = { text: 'Test Todo', done: true };
  render(<Todo todo={todo} />);
  expect(screen.getByText('This todo is done')).toBeInTheDocument();
});

test('calls onClickDelete when delete button is clicked', () => {
  const todo = { text: 'Test Todo', done: false };
  const onClickDelete = jest.fn();
  const onClickComplete = jest.fn();
  render(<Todo todo={todo} onClickComplete={onClickComplete} onClickDelete={onClickDelete} />);
  fireEvent.click(screen.getByText('Delete'));
  expect(onClickDelete).toHaveBeenCalledTimes(1);
  expect(onClickComplete).not.toHaveBeenCalled();
});

test('calls onClickComplete when set as done button is clicked', () => {
  const todo = { text: 'Test Todo', done: false };
  const onClickDelete = jest.fn();
  const onClickComplete = jest.fn();
  render(<Todo todo={todo} onClickComplete={onClickComplete} onClickDelete={onClickDelete} />);
  fireEvent.click(screen.getByText('Set as done'));
  expect(onClickComplete).toHaveBeenCalledTimes(1);
  expect(onClickDelete).not.toHaveBeenCalled();
});