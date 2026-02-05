import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // JSX Accessibility rules - strict mode for GC compliance
  // Note: jsx-a11y plugin is already included in eslint-config-next
  // We just need to configure stricter rules
  {
    rules: {
      // Enforce that all elements that require alternative text have meaningful information
      "jsx-a11y/alt-text": "error",

      // Enforce that anchors have content
      "jsx-a11y/anchor-has-content": "error",

      // Enforce that anchors are valid
      "jsx-a11y/anchor-is-valid": [
        "error",
        {
          components: ["Link"],
          specialLink: ["hrefLeft", "hrefRight"],
          aspects: ["invalidHref", "preferButton"],
        },
      ],

      // Enforce ARIA state and property values are valid
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-proptypes": "error",
      "jsx-a11y/aria-unsupported-elements": "error",

      // Enforce that elements with ARIA roles have required attributes
      "jsx-a11y/role-has-required-aria-props": "error",
      "jsx-a11y/role-supports-aria-props": "error",

      // Enforce tabIndex value is not greater than zero
      "jsx-a11y/tabindex-no-positive": "error",

      // Enforce heading (h1, h2, etc.) elements contain accessible content
      "jsx-a11y/heading-has-content": "error",

      // Enforce html element has lang prop
      "jsx-a11y/html-has-lang": "error",

      // Enforce iframe elements have a title attribute
      "jsx-a11y/iframe-has-title": "error",

      // Enforce img alt attribute does not contain the word image, picture, or photo
      "jsx-a11y/img-redundant-alt": "error",

      // Enforce that elements with interactive handlers have accessible roles
      "jsx-a11y/interactive-supports-focus": "error",

      // Enforce that a label tag has a text label and an associated control
      "jsx-a11y/label-has-associated-control": [
        "error",
        {
          assert: "either",
        },
      ],

      // Enforce lang attribute has a valid value
      "jsx-a11y/lang": "error",

      // Enforce media elements have captions
      "jsx-a11y/media-has-caption": "error",

      // Enforce that onMouseOver/onMouseOut are accompanied by onFocus/onBlur
      "jsx-a11y/mouse-events-have-key-events": "error",

      // Enforce that elements with onClick handlers also have onKeyDown, onKeyUp, etc.
      "jsx-a11y/click-events-have-key-events": "error",

      // Enforce no accessKey prop on element
      "jsx-a11y/no-access-key": "error",

      // Enforce no autofocus on elements
      "jsx-a11y/no-autofocus": ["error", { ignoreNonDOM: true }],

      // Enforce that elements with interactive roles and handlers use semantic elements
      "jsx-a11y/no-noninteractive-element-interactions": [
        "error",
        {
          handlers: [
            "onClick",
            "onMouseDown",
            "onMouseUp",
            "onKeyPress",
            "onKeyDown",
            "onKeyUp",
          ],
        },
      ],

      // Enforce interactive elements are not assigned non-interactive roles
      "jsx-a11y/no-noninteractive-element-to-interactive-role": [
        "error",
        {
          ul: ["listbox", "menu", "menubar", "radiogroup", "tablist", "tree"],
          ol: ["listbox", "menu", "menubar", "radiogroup", "tablist", "tree"],
          li: ["menuitem", "option", "row", "tab", "treeitem"],
          table: ["grid"],
          td: ["gridcell"],
        },
      ],

      // Enforce that non-interactive elements have no interactive handlers
      "jsx-a11y/no-static-element-interactions": [
        "error",
        {
          handlers: [
            "onClick",
            "onMouseDown",
            "onMouseUp",
            "onKeyPress",
            "onKeyDown",
            "onKeyUp",
          ],
        },
      ],

      // Enforce explicit role property is not the same as implicit/default role
      "jsx-a11y/no-redundant-roles": "error",

      // Enforce scope prop is only used on th elements
      "jsx-a11y/scope": "error",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Additional ignores
    "prisma/**",
    "lib/generated/**",
  ]),
]);

export default eslintConfig;
