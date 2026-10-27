import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../store";
import { AuthProvider } from "../context/authContext";
import { DataContextProvider } from "../context/dataContext";
import App from "../App";

// Cleanup DOM after each test
afterEach(() => {
  cleanup();
});

// Helper function to render App with all necessary wrappers
const renderWithProviders = (initialRoute = "/") => {
  return render(
    <Provider store={store}>
      <DataContextProvider>
        <AuthProvider>
          <MemoryRouter initialEntries={[initialRoute]}>
            <App />
          </MemoryRouter>
        </AuthProvider>
      </DataContextProvider>
    </Provider>,
  );
};

describe("App component test suite", () => {
  // Test Case 1: Checking redirects and initial landing
  it("should redirect unauthenticated users to the login page", () => {
    renderWithProviders("/");

    // Checks that the Login page heading is displayed
    const heading = screen.getByRole("heading", { name: /welcome back/i });
    expect(heading).toBeInTheDocument();
  });

  // Test Case 2: Checking presence of form elements
  it("should display email and password inputs with a submit button on login", () => {
    renderWithProviders("/login");

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i, {
      selector: "input",
    });
    const submitButton = screen.getByRole("button", { name: /^log in$/i });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  // Test Case 3: Testing user interaction (typing into inputs)
  it("should update input values when user types in email and password", () => {
    renderWithProviders("/login");

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i, {
      selector: "input",
    });

    fireEvent.change(emailInput, { target: { value: "user@crm.com" } });
    fireEvent.change(passwordInput, { target: { value: "user" } });

    expect(emailInput.value).toBe("user@crm.com");
    expect(passwordInput.value).toBe("user");
  });

  // Test Case 4: Route navigation to another page (Signup)
  it("should render the signup page when navigating to /signup", () => {
    renderWithProviders("/signup");

    const signupHeading = screen.getByRole("heading", {
      name: /create account/i,
    });
    expect(signupHeading).toBeInTheDocument();
  });

  // Test Case 5: 404 Not Found page for invalid routes
  it("should render 404 Not Found page when visiting an unknown URL", () => {
    renderWithProviders("/some-unknown-path-xyz");

    const notFoundText = screen.getByText(/lost in space\? page not found/i);
    expect(notFoundText).toBeInTheDocument();
  });
});
