import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login navigation', () => {
  render(<App />);
  expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
});
