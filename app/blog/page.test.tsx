import { render, screen } from '@testing-library/react';
import BlogPage from './page';

// Mock Next.js Link component
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = 'Link';
  return MockLink;
});

// Mock fetch
global.fetch = jest.fn();

describe('Blog Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders blog posts successfully', async () => {
    const mockPosts = [
      { userId: 1, id: 1, title: 'Test Post 1', body: 'Test body 1' },
      { userId: 1, id: 2, title: 'Test Post 2', body: 'Test body 2' },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPosts,
    });

    const component = await BlogPage();
    render(component);

    expect(screen.getByText('Blog Posts')).toBeInTheDocument();
    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Post 2')).toBeInTheDocument();
    expect(screen.getByText('Test body 1')).toBeInTheDocument();
    expect(screen.getByText('Test body 2')).toBeInTheDocument();
  });

  it('fetches posts from the correct API endpoint', async () => {
    const mockPosts = [
      { userId: 1, id: 1, title: 'Test Post', body: 'Test body' },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPosts,
    });

    await BlogPage();

    expect(global.fetch).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/posts?limit=10'
    );
  });

  it('throws error when fetch fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(BlogPage()).rejects.toThrow('Failed to fetch posts');
  });

  it('renders links to individual blog posts', async () => {
    const mockPosts = [
      { userId: 1, id: 1, title: 'Test Post 1', body: 'Test body 1' },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPosts,
    });

    const component = await BlogPage();
    render(component);

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/blog/1');
  });
});
