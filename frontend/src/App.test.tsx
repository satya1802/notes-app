import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import App from "./App";
import { api } from "@/api/client";
import { clearSessionToken, getSessionToken, setSessionToken } from "@/lib/api";

// App restores the session through the generated client, not fetch: stub its methods
// directly so each test controls exactly what /auth/me would have said.
vi.mock("@/api/client", () => ({
  api: { GET: vi.fn(), POST: vi.fn() },
}));

describe("App", () => {
  afterEach(() => {
    clearSessionToken();
    vi.mocked(api.GET).mockReset();
  });

  it("[AC-006] restores a signed-in, still-active session and reaches the notes list", async () => {
    // /notes is the owner's private list: a session token that the server still
    // recognizes (via /auth/me) is required to reach it, without re-entering a password.
    setSessionToken(crypto.randomUUID());
    vi.mocked(api.GET).mockResolvedValue({
      data: { id: "own_01", email: "owner@example.com", role: "owner" },
      error: undefined,
    } as never);

    render(
      <MemoryRouter initialEntries={["/notes"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(api.GET).toHaveBeenCalledWith("/auth/me");
    });
    // getAllByText, not getByText: the page may repeat its menu item's text.
    await waitFor(() => {
      expect(screen.getAllByText("Notes").length).toBeGreaterThan(0);
    });
  });

  it("[AC-007] ends an inactivity-expired session and shows the session-expired message", async () => {
    setSessionToken(crypto.randomUUID());
    vi.mocked(api.GET).mockResolvedValue({
      data: undefined,
      error: { detail: "Your session has expired. Sign in again." },
    } as never);

    render(
      <MemoryRouter initialEntries={["/notes"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      await screen.findByText("Your session expired. Please sign in again."),
    ).toBeInTheDocument();
    expect(screen.getByTestId("sign-in-to-notes-title")).toBeInTheDocument();
    await waitFor(() => {
      expect(getSessionToken()).toBeNull();
    });
  });

  it("[AC-009] validates whatever session token this browser holds via /auth/me before reaching the notes", async () => {
    // A different browser or device only has its own stored token; the same /auth/me
    // check is what lets it reach the same server-stored notes.
    const anotherBrowsersToken = crypto.randomUUID();
    setSessionToken(anotherBrowsersToken);
    vi.mocked(api.GET).mockResolvedValue({
      data: { id: "own_01", email: "owner@example.com", role: "owner" },
      error: undefined,
    } as never);

    render(
      <MemoryRouter initialEntries={["/notes"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(api.GET).toHaveBeenCalledWith("/auth/me");
    });
    await waitFor(() => {
      expect(screen.queryByTestId("sign-in-to-notes-title")).not.toBeInTheDocument();
    });
  });

  it("sends a visit with no session token straight to sign-in, with no expired message", async () => {
    render(
      <MemoryRouter initialEntries={["/notes"]}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByTestId("sign-in-to-notes-title")).toBeInTheDocument();
    expect(
      screen.queryByText("Your session expired. Please sign in again."),
    ).not.toBeInTheDocument();
    expect(api.GET).not.toHaveBeenCalled();
  });
});
