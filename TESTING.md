# Testing Guide

This project uses **Jest** and **React Testing Library** for testing.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Files

Test files are located next to the components they test with a `.test.tsx` extension:

- `app/page.test.tsx` - Tests for the home page
- `app/blog/page.test.tsx` - Tests for the blog listing page
- `app/blog/[id]/page.test.tsx` - Tests for individual blog post pages

## Test Structure

Each test file follows this pattern:

```typescript
import { render, screen } from '@testing-library/react';
import Component from './component';

describe('Component Name', () => {
  it('should do something', () => {
    render(<Component />);
    // assertions here
  });
});
```

## Mocking

### Mocking fetch API

```typescript
global.fetch = jest.fn();

(global.fetch as jest.Mock).mockResolvedValueOnce({
  ok: true,
  json: async () => ({ data: 'value' }),
});
```

### Mocking Next.js Components

Next.js components like `Link` and `Image` are mocked in the test files:

```typescript
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});
```

## Coverage

Coverage reports are configured to track:
- All files in the `app/` directory
- Excludes `layout.tsx` and `loading.tsx` files
- Excludes TypeScript definition files

## Pre-commit Hook

Tests automatically run before every commit via Husky. The pre-commit hook:
1. Runs ESLint
2. Runs TypeScript type checking
3. Runs Jest tests

## Writing New Tests

When adding new components:

1. Create a test file next to your component: `component.test.tsx`
2. Import necessary testing utilities
3. Mock any external dependencies (API calls, Next.js components)
4. Write descriptive test cases

### Example Test Template

```typescript
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interaction', () => {
    render(<MyComponent />);
    // Add interaction tests here
  });
});
```

## Common Testing Patterns

### Testing Async Server Components

```typescript
it('renders data from API', async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: 'value' }),
  });

  const component = await ServerComponent();
  render(component);

  expect(screen.getByText('value')).toBeInTheDocument();
});
```

### Testing Links

```typescript
it('contains correct link', () => {
  render(<Component />);
  const link = screen.getByRole('link', { name: /link text/i });
  expect(link).toHaveAttribute('href', '/expected-path');
});
```

### Testing Error Handling

```typescript
it('throws error on API failure', async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
  });

  await expect(fetchFunction()).rejects.toThrow('Expected error message');
});
```

## Best Practices

1. **Write descriptive test names** - Test names should clearly describe what is being tested
2. **Test user-visible behavior** - Focus on what users see and interact with
3. **Keep tests isolated** - Each test should be independent
4. **Mock external dependencies** - Don't make real API calls in tests
5. **Clean up after tests** - Use `beforeEach` to reset mocks
6. **Test error states** - Don't just test the happy path

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Next.js Testing Guide](https://nextjs.org/docs/testing)
