import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { api } from "@/api/client";
import { clearSessionToken, getSessionToken } from "@/lib/api";
import Screen from "./SignIn";

// The screen calls the API only through the generated client: stub that client's
// methods directly rather than touching fetch, so each test controls exactly what
// the backend would have said.
vi.mock("@/api/client", () => ({
  api: { POST: vi.fn() },
}));

function renderSignIn() {
  return render(
    <MemoryRouter initialEntries={["/sign-in"]}>
      <Screen />
    </MemoryRouter>,
  );
}

describe("SignIn", () => {
  afterEach(() => {
    clearSessionToken();
    vi.mocked(api.POST).mockReset();
  });

  it("[AC-001] shows every test id and message the screen spec requires", () => {
    renderSignIn();

    expect(screen.getByTestId("sign-in-to-notes-title")).toBeInTheDocument();
    expect(screen.getByTestId("owner-sign-in-form")).toBeInTheDocument();
    expect(screen.getByTestId("email-address-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByTestId("sign-in-btn")).toBeInTheDocument();
  });

  it("[AC-001] signs in with the correct email and password and is taken to the notes list", async () => {
    const user = userEvent.setup();
    const token = crypto.randomUUID();
    vi.mocked(api.POST).mockResolvedValue({ data: { token }, error: undefined } as never);

    renderSignIn();

    await user.type(screen.getByTestId("email-address-input"), "owner@example.com");
    await user.type(screen.getByTestId("password-input"), "correct horse battery");
    await user.click(screen.getByTestId("sign-in-btn"));

    await waitFor(() => {
      expect(api.POST).toHaveBeenCalledWith("/auth/login", {
        body: { email: "owner@example.com", password: "correct horse battery" },
      });
    });
    // Signing in stores the opaque session token the login endpoint returned, so the
    // generated client sends it as the bearer on every later call.
    await waitFor(() => {
      expect(getSessionToken()).toBe(token);
    });
  });

  it("[AC-002] shows the generic incorrect-credentials message without saying which field was wrong", async () => {
    const user = userEvent.setup();
    vi.mocked(api.POST).mockResolvedValue({
      data: undefined,
      error: { detail: "Invalid credentials" },
    } as never);

    renderSignIn();

    await user.type(screen.getByTestId("email-address-input"), "owner@example.com");
    await user.type(screen.getByTestId("password-input"), "wrong-password");
    await user.click(screen.getByTestId("sign-in-btn"));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Email or password is incorrect");
    expect(alert).not.toHaveTextContent(/email is wrong|password is wrong/i);
    expect(getSessionToken()).toBeNull();
  });

  it("[AC-002] retyping after a failed attempt clears the incorrect-credentials message", async () => {
    const user = userEvent.setup();
    vi.mocked(api.POST).mockResolvedValue({
      data: undefined,
      error: { detail: "Invalid credentials" },
    } as never);

    renderSignIn();

    await user.type(screen.getByTestId("email-address-input"), "owner@example.com");
    await user.type(screen.getByTestId("password-input"), "wrong-password");
    await user.click(screen.getByTestId("sign-in-btn"));
    await screen.findByRole("alert");

    await user.type(screen.getByTestId("password-input"), "x");

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("[AC-004] offers no registration or sign-up link anywhere on the screen", () => {
    renderSignIn();

    // No link, button or text inviting a visitor to register or create an account.
    expect(screen.queryByText(/sign up/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/sign-up/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/register/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/create an? account/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /sign up|register|create account/i }),
    ).not.toBeInTheDocument();
  });

  it("[AC-005] the screen exposes a single sign-in form for the one owner account, with no field to create another account", () => {
    const { container } = renderSignIn();

    // Exactly one form on the screen: the owner sign-in form, with only email and
    // password fields. No name, invite code or second-account field exists.
    expect(container.querySelectorAll("form")).toHaveLength(1);
    expect(screen.getByTestId("owner-sign-in-form")).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(1);
    expect(screen.queryByLabelText(/invite|confirm password|username/i)).not.toBeInTheDocument();
  });
});
