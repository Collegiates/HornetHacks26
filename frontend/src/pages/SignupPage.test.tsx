import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { SignupPage } from "./SignupPage";
import { useAuth } from "../hooks/useAuth";
import { signInWithGoogleOAuth } from "../lib/oauth";

vi.mock("../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../lib/oauth", () => ({
  signInWithGoogleOAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);
const mockedGoogleSignIn = vi.mocked(signInWithGoogleOAuth);

describe("SignupPage", () => {
  it("starts Google auth with the requested redirect target", async () => {
    const user = userEvent.setup();

    mockedUseAuth.mockReturnValue({
      loading: false,
      session: null,
      user: null,
      isDemo: false,
      signOut: vi.fn(),
      refreshSession: vi.fn(),
      startDemo: vi.fn(),
    });
    mockedGoogleSignIn.mockResolvedValue(undefined);

    render(
      <MemoryRouter initialEntries={["/signup?redirect=/dashboard"]}>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /continue with google/i }));

    expect(mockedGoogleSignIn).toHaveBeenCalledWith("/dashboard");
  });
});
