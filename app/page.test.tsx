import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { name: /welcome to my blog/i });
    expect(heading).toBeInTheDocument();
  });

  it('displays a link to the blog page', () => {
    render(<Home />);
    const blogLink = screen.getByRole('link', { name: /go to blog/i });
    expect(blogLink).toBeInTheDocument();
    expect(blogLink).toHaveAttribute('href', '/blog');
  });

  it('applies correct CSS classes', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { name: /welcome to my blog/i });
    expect(heading).toHaveClass('text-3xl', 'font-bold', 'underline');
  });
});
