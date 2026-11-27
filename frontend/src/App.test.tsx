import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import App from "./App";
import { clearSessionToken, setSessionToken } from "@/lib/api";

describe("App", () => {
  afterEach(() => {
    clearSessionToken();
  });

  it("renders a screen inside the app shell and shows its menu", () => {
    // /notes is the owner's private list: a session token is required to reach it.
    setSessionToken(crypto.randomUUID());
    render(
      <MemoryRouter initialEntries={["/notes"]}>
        <App />
      </MemoryRouter>,
    );
    // getAllByText, not getByText: the page may repeat its menu item's text.
    expect(screen.getAllByText("Notes").length).toBeGreaterThan(0);
  });
});
