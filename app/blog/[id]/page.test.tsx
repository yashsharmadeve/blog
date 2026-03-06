import { render, screen } from '@testing-library/react';
import Page, { generateMetadata } from './page';

// Mock Next.js components
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = 'Link';
  return MockLink;
});

jest.mock('next/image', () => {
  const MockImage = ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  };
  MockImage.displayName = 'Image';
  return MockImage;
});

// Mock fetch
global.fetch = jest.fn();

describe('Blog Post Detail Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders blog post details successfully', async () => {
    const mockPost = {
      userId: 1,
      id: 1,
      title: 'Test Post Title',
      body: 'This is the test post body content.',
    };

    const mockPhotos = [
      { url: 'https://via.placeholder.com/600/test' },
    ];

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPost,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPhotos,
      });

    const component = await Page({ params: { id: '1' } });
    render(component);

    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    expect(screen.getByText('This is the test post body content.')).toBeInTheDocument();
    expect(screen.getByText(/Post #1/)).toBeInTheDocument();
    expect(screen.getByText(/User 1/)).toBeInTheDocument();
  });

  it('renders back link to blog listing', async () => {
    const mockPost = {
      userId: 1,
      id: 1,
      title: 'Test Post',
      body: 'Test body',
    };

    const mockPhotos = [{ url: 'https://via.placeholder.com/600/test' }];

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPost,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPhotos,
      });

    const component = await Page({ params: { id: '1' } });
    render(component);

    const backLink = screen.getByRole('link', { name: /back to all posts/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/blog');
  });

  it('renders post image with correct attributes', async () => {
    const mockPost = {
      userId: 1,
      id: 1,
      title: 'Test Post',
      body: 'Test body',
    };

    const mockPhotos = [{ url: 'https://via.placeholder.com/600/test' }];

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPost,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPhotos,
      });

    const component = await Page({ params: { id: '1' } });
    render(component);

    const image = screen.getByAltText('Test Post');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://via.placeholder.com/600/test');
  });

  it('throws error when post fetch fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(Page({ params: { id: '1' } })).rejects.toThrow('Failed to fetch post');
  });

  it('throws error when image fetch fails', async () => {
    const mockPost = {
      userId: 1,
      id: 1,
      title: 'Test Post',
      body: 'Test body',
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPost,
      })
      .mockResolvedValueOnce({
        ok: false,
      });

    await expect(Page({ params: { id: '1' } })).rejects.toThrow('Failed to fetch image');
  });
});

describe('generateMetadata', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('generates correct metadata for blog post', async () => {
    const mockPost = {
      userId: 1,
      id: 1,
      title: 'Test Post Title',
      body: 'This is the test post body content that is quite long and will be truncated.',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPost,
    });

    const metadata = await generateMetadata({ params: { id: '1' } });

    expect(metadata.title).toBe('Test Post Title');
    expect(metadata.description).toBe(mockPost.body.substring(0, 160));
    expect(metadata.openGraph?.title).toBe('Test Post Title');
  });
});
