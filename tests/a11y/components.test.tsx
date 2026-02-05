import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { testA11y, checkHeadingHierarchy } from "./helpers";

// Mock the GCDS components since they're web components
vi.mock("@cdssnc/gcds-components-react-ssr", () => ({
  GcdsHeader: ({ children, ...props }: { children?: React.ReactNode }) => (
    <header role="banner" {...props}>
      {children}
    </header>
  ),
  GcdsFooter: (props: Record<string, unknown>) => (
    <footer role="contentinfo" {...props} />
  ),
  GcdsTopNav: ({ children, ...props }: { children?: React.ReactNode }) => (
    <nav {...props}>{children}</nav>
  ),
  GcdsNavLink: ({
    children,
    href,
  }: {
    children?: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
  GcdsLangToggle: () => <button type="button">Language Toggle</button>,
}));

// Test wrapper component for layout testing
function TestLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header role="banner">
        <nav aria-label="Main navigation">
          <a href="https://example.com">Home</a>
        </nav>
      </header>
      <main id="main-content" role="main">
        {children}
      </main>
      <footer role="contentinfo">
        <p>Government of Canada</p>
      </footer>
    </div>
  );
}

describe("Accessibility Tests", () => {
  describe("Layout Structure", () => {
    it("should have proper landmark regions", async () => {
      const { results } = await testA11y(
        <TestLayout>
          <h1>Test Page</h1>
          <p>Test content</p>
        </TestLayout>
      );

      expect(results).toHaveNoViolations();
    });

    it("should have a skip link", () => {
      render(
        <TestLayout>
          <h1>Test</h1>
        </TestLayout>
      );

      const skipLink = screen.getByText("Skip to main content");
      expect(skipLink).toBeDefined();
      expect(skipLink.getAttribute("href")).toBe("#main-content");
    });

    it("should have proper heading hierarchy", () => {
      const { container } = render(
        <TestLayout>
          <h1>Main Title</h1>
          <h2>Section 1</h2>
          <h3>Subsection</h3>
          <h2>Section 2</h2>
        </TestLayout>
      );

      const { isValid, issues } = checkHeadingHierarchy(container);
      expect(isValid).toBe(true);
      expect(issues).toHaveLength(0);
    });

    it("should detect skipped heading levels", () => {
      const { container } = render(
        <TestLayout>
          <h1>Main Title</h1>
          <h4>Skipped to h4</h4>
        </TestLayout>
      );

      const { isValid, issues } = checkHeadingHierarchy(container);
      expect(isValid).toBe(false);
      expect(issues.length).toBeGreaterThan(0);
    });
  });

  describe("Navigation", () => {
    it("should have accessible navigation", async () => {
      const { results } = await testA11y(
        <nav aria-label="Main navigation">
          <ul>
            <li>
              <a href="https://example.com">Home</a>
            </li>
            <li>
              <a href="https://example.com/about">About</a>
            </li>
          </ul>
        </nav>,
        { axeOptions: { rules: { region: { enabled: false } } } }
      );

      expect(results).toHaveNoViolations();
    });
  });

  describe("Forms", () => {
    it("should have accessible form fields", async () => {
      const { results } = await testA11y(
        <form>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit">Submit</button>
        </form>,
        {
          axeOptions: {
            rules: {
              region: { enabled: false },
            },
          },
        }
      );

      expect(results).toHaveNoViolations();
    });

    it("should have accessible error states", async () => {
      const { results } = await testA11y(
        <form>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              aria-invalid="true"
              aria-describedby="email-error"
            />
            <p id="email-error" role="alert">
              Please enter a valid email address
            </p>
          </div>
        </form>,
        {
          axeOptions: {
            rules: {
              region: { enabled: false },
            },
          },
        }
      );

      expect(results).toHaveNoViolations();
    });
  });

  describe("Interactive Elements", () => {
    it("should have accessible buttons", async () => {
      const { results } = await testA11y(
        <div>
          <button type="button">Click me</button>
          <button type="button" aria-label="Close dialog">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>,
        {
          axeOptions: {
            rules: {
              region: { enabled: false },
            },
          },
        }
      );

      expect(results).toHaveNoViolations();
    });

    it("should have accessible links", async () => {
      const { results } = await testA11y(
        <div>
          <a href="https://example.com/page">Internal link</a>
          <a href="https://example.com" target="_blank" rel="noopener">
            External link
            <span className="sr-only">(opens in new tab)</span>
          </a>
        </div>,
        {
          axeOptions: {
            rules: {
              region: { enabled: false },
            },
          },
        }
      );

      expect(results).toHaveNoViolations();
    });
  });

  describe("Images and Media", () => {
    it("should have accessible images", async () => {
      const { results } = await testA11y(
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Government of Canada logo" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/decorative.png" alt="" role="presentation" />
        </div>,
        {
          axeOptions: {
            rules: {
              region: { enabled: false },
            },
          },
        }
      );

      expect(results).toHaveNoViolations();
    });
  });

  describe("Tables", () => {
    it("should have accessible tables", async () => {
      const { results } = await testA11y(
        <table>
          <caption>User Statistics</caption>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Role</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>Admin</td>
              <td>Active</td>
            </tr>
          </tbody>
        </table>,
        {
          axeOptions: {
            rules: {
              region: { enabled: false },
            },
          },
        }
      );

      expect(results).toHaveNoViolations();
    });
  });
});
