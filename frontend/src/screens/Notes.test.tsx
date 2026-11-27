import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
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

// The right-hand panel starts in a brief loading state before it shows the "new
// note" editor, so every test that opens it waits a little longer than the default
// findBy timeout.
const PANEL_TIMEOUT = { timeout: 2000 };

async function openNewNote(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId("new-note-btn"));
  return screen.findByTestId("note-text-plain-text-only-input", {}, PANEL_TIMEOUT);
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

describe("Notes - create a plain-text note", () => {
  afterEach(() => {
    clearSessionToken();
    vi.mocked(api.POST).mockReset();
  });

  it("[AC-011] the new note field is plain text only — no formatting, checklist, image or attachment controls", async () => {
    const user = userEvent.setup();
    setSessionToken(crypto.randomUUID());

    renderNotes();

    const textarea = await openNewNote(user);
    expect(textarea.tagName).toBe("TEXTAREA");

    // No rich-text, checklist, image or attachment controls anywhere near the input.
    expect(
      screen.queryByRole("button", { name: /^(bold|italic|checklist|image|attachment|upload)$/i }),
    ).not.toBeInTheDocument();

    await user.type(textarea, "**not bold** {[} ] not a checklist");
    expect((textarea as HTMLTextAreaElement).value).toBe("**not bold** [ ] not a checklist");
  });

  it("[AC-010] creates a new note from the entered text, recording it through POST /notes", async () => {
    const user = userEvent.setup();
    setSessionToken(crypto.randomUUID());
    vi.mocked(api.POST).mockResolvedValue({
      data: { id: "note_new1", text: "Buy oat milk", createdAt: "2026-11-27T09:30:00.000Z" },
      error: undefined,
    } as never);

    renderNotes();

    const textarea = await openNewNote(user);
    await user.type(textarea, "Buy oat milk");
    fireEvent.blur(textarea);

    await waitFor(() => {
      expect(api.POST).toHaveBeenCalledWith("/notes", { body: { text: "Buy oat milk" } });
    });

    await screen.findByText("Saved");

    // [AC-012] back in the notes list, the just-created note is there.
    const list = await screen.findByTestId("sorted-by-most-recent-activity-list");
    expect(within(list).getByText("Buy oat milk")).toBeInTheDocument();
  });

  it("[AC-010] shows a saving status while the request to the server is in flight", async () => {
    const user = userEvent.setup();
    setSessionToken(crypto.randomUUID());
    let resolvePost: (value: unknown) => void = () => {};
    vi.mocked(api.POST).mockReturnValue(
      new Promise((resolve) => {
        resolvePost = resolve;
      }) as never,
    );

    renderNotes();

    const textarea = await openNewNote(user);
    await user.type(textarea, "Call the plumber");
    fireEvent.blur(textarea);

    await screen.findByText("Saving to the server…");

    resolvePost({
      data: { id: "note_new2", text: "Call the plumber", createdAt: "2026-11-27T09:31:00.000Z" },
      error: undefined,
    });

    await screen.findByText("Saved");
  });

  it("[AC-010] shows the connection error and keeps the typed text when the save fails", async () => {
    const user = userEvent.setup();
    setSessionToken(crypto.randomUUID());
    vi.mocked(api.POST).mockRejectedValue(new Error("network error"));

    renderNotes();

    const textarea = await openNewNote(user);
    await user.type(textarea, "Reading list");
    fireEvent.blur(textarea);

    await screen.findByText("Changes not saved — check your connection");
    expect((textarea as HTMLTextAreaElement).value).toBe("Reading list");

    // The failed note was never created, so it is not in the list.
    expect(screen.queryByText("Reading list", { selector: "span" })).not.toBeInTheDocument();
  });
});
