# React Testing Mastery & Interview Guide (Vitest + React Testing Library)

A practical, interview-ready cheat sheet and reference guide for unit and integration testing in React applications.

---

## 📑 Table of Contents
1. [Core Testing Mental Model (AAA Pattern)](#1-core-testing-mental-model-aaa-pattern)
2. [The Golden Rule of React Testing Library](#2-the-golden-rule-of-react-testing-library)
3. [Vitest vs Jest vs React Testing Library](#3-vitest-vs-jest-vs-react-testing-library)
4. [Query Priority Guide (Which query to choose?)](#4-query-priority-guide-which-query-to-choose)
5. [The Big Difference: `getBy*` vs `queryBy*` vs `findBy*`](#5-the-big-difference-getby-vs-queryby-vs-findby)
6. [Handling Wrappers: Router, Redux, and Context](#6-handling-wrappers-router-redux-and-context)
7. [User Interactions: `fireEvent` vs `userEvent`](#7-user-interactions-fireevent-vs-userevent)
8. [Asynchronous Testing & Mocking](#8-asynchronous-testing--mocking)
9. [Common Gotchas & How to Avoid Them](#9-common-gotchas--how-to-avoid-them)
10. [Top React Testing Interview Questions & Answers](#10-top-react-testing-interview-questions--answers)

---

## 1. Core Testing Mental Model (AAA Pattern)

Every frontend test case follows a simple 4-step sequence (Arrange, Locate, Act, Assert):

```text
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   1. ARRANGE    │ ──> │   2. LOCATE     │ ──> │    3. ACT       │ ──> │   4. ASSERT     │
│ Render element  │     │ Find by label/  │     │ Click, type,    │     │ Expect result   │
│ & providers     │     │ role/text       │     │ or scroll       │     │ to match        │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Practical Example:
```jsx
it("should update input values when user types in email and password", () => {
  // 1. ARRANGE
  renderWithProviders("/login");

  // 2. LOCATE
  const emailInput = screen.getByLabelText(/email address/i);
  const passwordInput = screen.getByLabelText(/password/i, { selector: "input" });

  // 3. ACT
  fireEvent.change(emailInput, { target: { value: "user@crm.com" } });
  fireEvent.change(passwordInput, { target: { value: "secret123" } });

  // 4. ASSERT
  expect(emailInput.value).toBe("user@crm.com");
  expect(passwordInput.value).toBe("secret123");
});
```

---

## 2. The Golden Rule of React Testing Library

> **"The more your tests resemble the way your software is used, the more confidence they can give you."** — Kent C. Dodds

### Do's and Don'ts:
- ❌ **Don't test implementation details**: Do not check internal component state (`wrapper.state()`), private methods, or CSS class names.
- ✅ **Test user-observable behavior**: Does the user see the heading? Does clicking the button show the modal? Does entering invalid input show an error message?

---

## 3. Vitest vs Jest vs React Testing Library

| Tool | Role | What it does |
| :--- | :--- | :--- |
| **Vitest / Jest** | **Test Runner & Assertion Library** | Provides `describe`, `it`, `expect`, `beforeEach`, `afterEach`, and runs the test suite in Node. |
| **React Testing Library (RTL)** | **DOM Testing Utility** | Renders React components in a virtual DOM (JSDOM) and gives methods (`render`, `screen`) to query elements like a user. |
| **Jest-DOM (`@testing-library/jest-dom`)** | **Custom Matchers** | Adds readable DOM assertions like `.toBeInTheDocument()`, `.toHaveValue()`, `.toBeDisabled()`. |

---

## 4. Query Priority Guide (Which query to choose?)

Always find elements in this priority order, reflecting how assistive technology and users interact with the page:

| Priority | Method | Recommended For | Example |
| :---: | :--- | :--- | :--- |
| **1st** | `getByRole` | Buttons, Headings, Links, Checkboxes, Dialogs | `screen.getByRole("button", { name: /log in/i })` |
| **2nd** | `getByLabelText` | Form inputs tied to a `<label>` or `aria-label` | `screen.getByLabelText(/email address/i)` |
| **3rd** | `getByPlaceholderText` | Form inputs without visible labels | `screen.getByPlaceholderText(/name@example.com/i)` |
| **4th** | `getByText` | Headings, paragraphs, error banners, badge text | `screen.getByText(/account created successfully/i)` |
| **5th** | `getByDisplayValue` | Pre-filled form inputs | `screen.getByDisplayValue("admin@crm.com")` |
| **Last**| `getByTestId` | Complex canvas, SVGs, or elements with no text | `screen.getByTestId("custom-spinner")` |

> **Pro Tip**: Always use case-insensitive regex (e.g. `/log in/i`) instead of exact strings (`"Log In"`). It avoids tests breaking over simple CSS uppercase text transforms.

---

## 5. The Big Difference: `getBy*` vs `queryBy*` vs `findBy*`

*This is one of the most frequently asked React testing interview questions.*

| Query Type | When element is NOT found | When element IS found | Sync or Async | Best Use Case |
| :--- | :--- | :--- | :---: | :--- |
| **`getBy...`** | ❌ **Throws Error** | Returns Element | Sync | Standard check. Expecting element to be immediately in the DOM. |
| **`queryBy...`** | ✅ Returns `null` (No error) | Returns Element | Sync | **Asserting absence**: verifying that an element does NOT exist. |
| **`findBy...`** | ❌ **Throws Error** (after timeout) | Returns Promise<Element> | **Async** (`await`) | Elements that appear **after** an API call, state change, or timer. |

### Code Comparison:
```jsx
// 1. Element exists immediately
expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();

// 2. Element should NOT be on screen (use queryBy)
expect(screen.queryByText(/error loading data/i)).not.toBeInTheDocument();

// 3. Element loads after an async API request (use findBy)
const successBadge = await screen.findByText(/saved successfully/i);
expect(successBadge).toBeInTheDocument();
```

---

## 6. Handling Wrappers: Router, Redux, and Context

### Why Bare `render(<App />)` Fails:
If a component relies on:
- **React Router** (`<Routes>`, `useNavigate`, `useLocation`) 👉 Must have a Router parent.
- **Redux** (`useSelector`, `useDispatch`) 👉 Must have `<Provider store={store}>`.
- **Custom Context** (`useAuthState`) 👉 Must have `<AuthProvider>`.

### The Best Practice: Custom Render Utility
Create a reusable helper in your test file or `src/test/test-utils.jsx`:

```jsx
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../store";
import { AuthProvider } from "../context/authContext";
import { DataContextProvider } from "../context/dataContext";

export const renderWithProviders = (
  ui,
  {
    initialRoute = "/",
    customStore = store,
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => (
    <Provider store={customStore}>
      <DataContextProvider>
        <AuthProvider>
          <MemoryRouter initialEntries={[initialRoute]}>
            {children}
          </MemoryRouter>
        </AuthProvider>
      </DataContextProvider>
    </Provider>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};
```

> **Interview Tip**: In tests, always use `MemoryRouter` instead of `BrowserRouter` because `MemoryRouter` does not depend on the browser URL bar and allows you to test any route instantly using `initialEntries={["/products/123"]}`.

---

## 7. User Interactions: `fireEvent` vs `userEvent`

| Feature | `fireEvent` | `@testing-library/user-event` |
| :--- | :--- | :--- |
| **How it works** | Dispatches a single synthetic DOM event directly | Simulates full browser lifecycle (hover, focus, keydown, keypress, input, keyup) |
| **Realism** | Basic | High (closest to real user actions) |
| **Speed** | Faster | Slightly slower |
| **Syntax** | `fireEvent.click(btn)` | `await userEvent.click(btn)` |

---

## 8. Asynchronous Testing & Mocking

### 1. Waiting for Elements with `waitFor`:
When you expect an element to change after some async action:
```jsx
import { waitFor } from "@testing-library/react";

fireEvent.click(submitBtn);

await waitFor(() => {
  expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
});
```

### 2. Mocking Functions & Modules (Vitest):
```jsx
import { vi } from "vitest";

// Mock an API function or module
vi.mock("../services/api", () => ({
  fetchUserProfile: vi.fn().mockResolvedValue({ name: "Alex", role: "Admin" }),
}));
```

---

## 9. Common Gotchas & How to Avoid Them

### Gotcha 1: `it.only` Left in Code
- **Symptom**: `1 passed | 4 skipped`.
- **Cause**: `.only` tells the runner to run only that test.
- **Fix**: Remove `.only` so all tests run.

### Gotcha 2: "Found multiple elements with text..."
- **Symptom**: `TestingLibraryElementError: Found multiple elements...`
- **Cause**: Multiple elements matched the query (e.g. `<label>` and a `<button aria-label="...">`).
- **Fix**: Narrow the selector:
  ```jsx
  screen.getByLabelText(/password/i, { selector: "input" });
  // or use getAllBy...
  const buttons = screen.getAllByRole("button");
  ```

### Gotcha 3: DOM Not Cleaning Up Between Tests
- **Symptom**: Elements from previous tests still exist in the current test.
- **Fix**: In Vitest, enable `globals: true` in `vite.config.js` or call `afterEach(() => cleanup())`.

---

## 10. Top React Testing Interview Questions & Answers

### Q1: What is the difference between Unit, Integration, and E2E testing in React?
- **Unit Testing**: Tests an isolated unit (a single button, pure function, or hook) independently from other components.
- **Integration Testing**: Tests multiple units working together (e.g., rendering `App` with `MemoryRouter`, Redux store, and form submit flow). React Testing Library is primarily an integration testing tool.
- **End-to-End (E2E) Testing**: Runs the whole compiled application in a real browser (using Cypress or Playwright) communicating with a real or mocked backend.

### Q2: What should you NOT test in React components?
- Third-party library code (e.g., do not test if Axios works).
- Internal implementation details (state variable names, private hooks).
- CSS style rules unless it directly controls accessibility (like `aria-hidden` or `display: none`).

### Q3: When should you use `findBy` instead of `getBy`?
- Use `getBy*` when the element is already rendered synchronously in the DOM.
- Use `findBy*` whenever an element appears asynchronously (e.g. after a `fetch()` / `axios` call, a `setTimeout`, or animation). `findBy*` returns a Promise that retries until a default timeout (usually 1000ms).

### Q4: Why is `getByRole` preferred over `getByTestId`?
`getByRole` enforces accessibility (a11y). If a button cannot be queried with `getByRole("button")`, it means screen readers also cannot detect it properly (e.g., a `<div>` was used instead of a `<button>`). `getByTestId` should only be a fallback.

### Q5: What does the "act(...)" warning mean and how do you resolve it?
The warning `"An update to Component inside a test was not wrapped in act(...)"` happens when a state update occurs outside of React's testing boundary (e.g., an unawaited Promise or pending timer).
- **Solution**: Ensure all asynchronous actions are awaited using `await screen.findBy...` or `await waitFor(...)`.

---

## 💡 Quick Revision Cheat Sheet

```jsx
// 1. Querying an element
screen.getByRole("button", { name: /save/i });
screen.getByLabelText(/email/i);

// 2. Checking if it's there
expect(element).toBeInTheDocument();
expect(element).toHaveValue("test@mail.com");
expect(element).toBeDisabled();

// 3. Checking if it is NOT there
expect(screen.queryByText(/error/i)).not.toBeInTheDocument();

// 4. Waiting for async element
const item = await screen.findByText(/order #123/i);
expect(item).toBeInTheDocument();

// 5. Simulating user action
fireEvent.change(input, { target: { value: "hello" } });
fireEvent.click(button);
```
