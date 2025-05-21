import { render, screen } from '@testing-library/react';
import { Button } from '../button';

describe('Button Component', () => {
  test('renders with default props and children', () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
  });

  test('renders with a specific variant', () => {
    render(<Button variant="destructive">Delete</Button>);
    const buttonElement = screen.getByRole('button', { name: /delete/i });
    expect(buttonElement).toBeInTheDocument();
    // Assuming 'destructive' variant adds a specific class, e.g., 'bg-destructive' or similar
    // This part of the test might need adjustment based on actual class names used for variants
    expect(buttonElement).toHaveClass('bg-destructive');
  });

  test('renders as child when asChild prop is true', () => {
    render(<Button asChild><a href="#">Link Button</a></Button>);
    const linkElement = screen.getByRole('link', { name: /link button/i });
    expect(linkElement).toBeInTheDocument();
  });
});
