import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuth } from "../hooks/useAuth";

vi.mock("../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

function LoginDestination() {
  const location = useLocation();
  return <div>Login {location.search}</div>;
}

describe("ProtectedRoute", () => {
  it("shows a loading spinner while the session is resolving", () => {
    mockedUseAuth.mockReturnValue({
      loading: true,
      session: null,
      user: null,
      isDemo: false,
      signOut: vi.fn(),
      refreshSession: vi.fn(),
      startDemo: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/event/abc"]}>
        <Routes>
          <Route
            path="/event/:id"
            element={
              <ProtectedRoute>
                <div>Secret gallery</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Checking your session...")).toBeInTheDocument();
  });

  it("redirects unauthenticated users to login with the original URL preserved", () => {
    mockedUseAuth.mockReturnValue({
      loading: false,
      session: null,
      user: null,
      isDemo: false,
      signOut: vi.fn(),
      refreshSession: vi.fn(),
      startDemo: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/event/abc123?tab=all"]}>
        <Routes>
          <Route
            path="/event/:id"
            element={
              <ProtectedRoute>
                <div>Secret gallery</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginDestination />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/redirect=%2Fevent%2Fabc123%3Ftab%3Dall/)).toBeInTheDocument();
  });
});
