import { render, type RenderResult } from "@testing-library/react";
import { axe } from "vitest-axe";

/**
 * Test a component for accessibility violations
 *
 * @param ui - React component to test
 * @param options - Optional axe configuration
 * @returns RenderResult and accessibility results
 *
 * @example
 * ```tsx
 * it("should have no accessibility violations", async () => {
 *   const { results } = await testA11y(<MyComponent />);
 *   expect(results).toHaveNoViolations();
 * });
 * ```
 */
export async function testA11y(
  ui: React.ReactElement,
  options?: {
    axeOptions?: Parameters<typeof axe>[1];
  }
) {
  const renderResult = render(ui);
  const results = await axe(renderResult.container, options?.axeOptions);

  return {
    ...renderResult,
    results,
  };
}

/**
 * Common axe rules to disable for specific scenarios
 */
export const axeDisableRules = {
  // Disable for components that are not complete pages
  pageLevel: ["region", "landmark-one-main"],
  // Disable for components using custom color schemes
  colorContrast: ["color-contrast"],
  // Disable for testing skeleton/loading states
  loading: ["aria-hidden-focus"],
};

/**
 * Helper to check if a component is keyboard navigable
 */
export async function checkKeyboardNavigation(
  renderResult: RenderResult,
  expectedOrder: string[]
) {
  const { container } = renderResult;
  const focusableElements = container.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  const actualOrder = Array.from(focusableElements).map(
    (el) =>
      el.getAttribute("data-testid") ||
      el.getAttribute("aria-label") ||
      el.textContent?.trim()
  );

  return {
    focusableElements,
    actualOrder,
    matches: JSON.stringify(actualOrder) === JSON.stringify(expectedOrder),
  };
}

/**
 * Helper to verify ARIA labels are present
 */
export function checkAriaLabels(
  container: HTMLElement,
  expectedLabels: string[]
) {
  const labeledElements = container.querySelectorAll("[aria-label]");
  const labels = Array.from(labeledElements).map((el) =>
    el.getAttribute("aria-label")
  );

  return {
    labels,
    missingLabels: expectedLabels.filter((label) => !labels.includes(label)),
  };
}

/**
 * Helper to check heading hierarchy
 */
export function checkHeadingHierarchy(container: HTMLElement) {
  const headings = container.querySelectorAll("h1, h2, h3, h4, h5, h6");
  const levels = Array.from(headings).map((h) =>
    parseInt(h.tagName.substring(1))
  );

  const issues: string[] = [];

  // Check for multiple h1s
  const h1Count = levels.filter((l) => l === 1).length;
  if (h1Count > 1) {
    issues.push(`Multiple h1 elements found (${h1Count})`);
  }

  // Check for skipped levels
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) {
      issues.push(
        `Heading level skipped: h${levels[i - 1]} followed by h${levels[i]}`
      );
    }
  }

  return {
    levels,
    issues,
    isValid: issues.length === 0,
  };
}
