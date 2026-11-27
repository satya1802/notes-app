import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { api } from "@/api/client";
import { clearSessionToken, getSessionToken, setSessionToken } from "@/lib/api";
import Screen from "./Notes";

// Notes calls the API only through the generated client: stub that client's methods
// directly rather than touching fetch, so the test controls exactly what the backend
// would have said.
vi.mock("@/api/client", () => ({
  api: { GET: vi.fn(), POST: vi.fn() },
}));

const mockNavigate = vi.fn();
vi.mock("@/lib/navigate", () => ({
  useNavigate: () => mockNavigate,
}));

function renderNotes() {
  return render(
    <MemoryRouter initialEntries={["/notes"]}>
      <Screen />
    </MemoryRouter>,
  );
}

describe("Notes - sign out", () => {
  afterEach(() => {
    clearSessionToken();
    vi.mocked(api.POST).mockReset();
    mockNavigate.mockReset();
  });

  it("[AC-008] signs out: calls /auth/logout, clears the session, and returns to sign in", async () => {
    const user = userEvent.setup();
    setSessionToken(crypto.randomUUID());
    vi.mocked(api.POST).mockResolvedValue({ data: undefined, error: undefined } as never);

    renderNotes();

    await user.click(screen.getByRole("button", { name: /sign out/i }));

    await waitFor(() => {
      expect(api.POST).toHaveBeenCalledWith("/auth/logout");
    });
    await waitFor(() => {
      expect(getSessionToken()).toBeNull();
    });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("sign-in");
    });
  });

  it("[AC-008] still clears the session and returns to sign in when the logout request fails", async () => {
    const user = userEvent.setup();
    setSessionToken(crypto.randomUUID());
    vi.mocked(api.POST).mockRejectedValue(new Error("network error"));

    renderNotes();

    await user.click(screen.getByRole("button", { name: /sign out/i }));

    await waitFor(() => {
      expect(getSessionToken()).toBeNull();
    });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("sign-in");
    });
  });
});
