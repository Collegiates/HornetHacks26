import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "./LoginPage";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";

vi.mock("../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
    },
  },
}));

const mockedUseAuth = vi.mocked(useAuth);
const mockedSignIn = vi.mocked(supabase.auth.signInWithPassword);

describe("LoginPage", () => {
  it("logs the user in and respects the redirect query param", async () => {
    const user = userEvent.setup();
    const refreshSession = vi.fn().mockResolvedValue(undefined);

    mockedUseAuth.mockReturnValue({
      loading: false,
      session: null,
      user: null,
      isDemo: false,
      signOut: vi.fn(),
      refreshSession,
      startDemo: vi.fn(),
    });
    mockedSignIn.mockResolvedValue({
      data: { session: null, user: null },
      error: null,
    } as never);

    render(
      <MemoryRouter initialEntries={["/login?redirect=/event/abc123"]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/event/:id" element={<div>Event destination</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText("Email"), "guest@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(refreshSession).toHaveBeenCalled();
      expect(screen.getByText("Event destination")).toBeInTheDocument();
    });

    expect(mockedSignIn).toHaveBeenCalledWith({
      email: "guest@example.com",
      password: "password123",
    });
  });

  it("starts demo mode and navigates to the redirect target", async () => {
    const user = userEvent.setup();
    const startDemo = vi.fn().mockResolvedValue(undefined);

    mockedUseAuth.mockReturnValue({
      loading: false,
      session: null,
      user: null,
      isDemo: false,
      signOut: vi.fn(),
      refreshSession: vi.fn(),
      startDemo,
    });
    mockedSignIn.mockReset();

    render(
      <MemoryRouter initialEntries={["/login?redirect=/dashboard"]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<div>Demo dashboard</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", { name: "Continue with demo" }),
    );

    await waitFor(() => {
      expect(startDemo).toHaveBeenCalled();
      expect(screen.getByText("Demo dashboard")).toBeInTheDocument();
    });
  });
});
