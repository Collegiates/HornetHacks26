import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AccountSettingsPage } from "./AccountSettingsPage";
import { useAuth } from "../hooks/useAuth";
import { apiFetch } from "../lib/api";

vi.mock("../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../lib/api", () => ({
  apiFetch: vi.fn(),
}));

vi.mock("../components/FaceScanCapture", () => ({
  FaceScanCapture: ({
    title,
    onSkip,
  }: {
    title: string;
    onSkip?: () => void;
  }) => (
    <div>
      <p>{title}</p>
      <button type="button" onClick={onSkip}>
        Skip for now
      </button>
    </div>
  ),
}));

const mockedUseAuth = vi.mocked(useAuth);
const mockedApiFetch = vi.mocked(apiFetch);

describe("AccountSettingsPage", () => {
  beforeEach(() => {
    mockedApiFetch.mockReset();
  });

  it("shows the active badge and opens the retake face scan flow", async () => {
    const user = userEvent.setup();

    mockedUseAuth.mockReturnValue({
      loading: false,
      session: { access_token: "token" } as never,
      user: {
        id: "user-1",
        email: "jordan@example.com",
        name: "Jordan Lee",
        hasFaceProfile: true,
      },
      isDemo: false,
      signOut: vi.fn(),
      refreshSession: vi.fn(),
      startDemo: vi.fn(),
    });

    mockedApiFetch.mockResolvedValue({
      user: {
        id: "user-1",
        email: "jordan@example.com",
        name: "Jordan Lee",
        hasFaceProfile: true,
      },
    } as never);

    render(
      <MemoryRouter initialEntries={["/account/settings"]}>
        <Routes>
          <Route path="/account/settings" element={<AccountSettingsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Face profile active")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Retake face scan" }));

    expect(screen.getByText("Retake your face scan")).toBeInTheDocument();
  });

  it("confirms and deletes the face profile", async () => {
    const user = userEvent.setup();
    const refreshSession = vi.fn().mockResolvedValue(undefined);
    let accountLoadCount = 0;

    mockedUseAuth.mockReturnValue({
      loading: false,
      session: { access_token: "token" } as never,
      user: {
        id: "user-1",
        email: "jordan@example.com",
        name: "Jordan Lee",
        hasFaceProfile: true,
      },
      isDemo: false,
      signOut: vi.fn(),
      refreshSession,
      startDemo: vi.fn(),
    });

    mockedApiFetch.mockImplementation(async (path: string) => {
      if (path === "/api/account") {
        accountLoadCount += 1;
        return {
          user: {
            id: "user-1",
            email: "jordan@example.com",
            name: "Jordan Lee",
            hasFaceProfile: accountLoadCount === 1,
          },
        };
      }

      if (path === "/api/account/face-profile") {
        return {};
      }

      throw new Error(`Unexpected path: ${path}`);
    });

    render(
      <MemoryRouter initialEntries={["/account/settings"]}>
        <Routes>
          <Route path="/account/settings" element={<AccountSettingsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Face profile active")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Delete face profile" }));
    await user.click(screen.getAllByRole("button", { name: "Delete face profile" })[0]);

    await waitFor(() => {
      expect(mockedApiFetch).toHaveBeenCalledWith(
        "/api/account/face-profile",
        expect.objectContaining({ method: "DELETE" }),
      );
      expect(refreshSession).toHaveBeenCalled();
    });

    expect(await screen.findByText("Face profile removed.")).toBeInTheDocument();
  });
});
