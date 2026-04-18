import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { EventSettingsPage } from "./EventSettingsPage";
import { apiFetch } from "../lib/api";

vi.mock("../lib/api", () => ({
  apiFetch: vi.fn(),
}));

vi.mock("qrcode.react", () => ({
  QRCodeCanvas: ({ value }: { value: string }) => <div>QR {value}</div>,
}));

const mockedApiFetch = vi.mocked(apiFetch);

function EventRedirectDestination() {
  const location = useLocation();
  return <div>Gallery redirect {location.pathname}{location.search}</div>;
}

describe("EventSettingsPage", () => {
  beforeEach(() => {
    mockedApiFetch.mockReset();
  });

  it("redirects non-creators back to the event page with the denied flag", async () => {
    mockedApiFetch.mockImplementation(async (path: string) => {
      if (path === "/api/events/event-1") {
        return {
          id: "event-1",
          name: "Launch Party",
          date: "2026-05-10",
          expiresAt: "2026-06-09",
          status: "active",
          joinToken: "join-token",
          role: "member",
          creator: { id: "creator-1", name: "Taylor" },
          counts: { allPhotos: 8, myPhotos: 1, members: 4 },
        };
      }

      if (path === "/api/events/event-1/members") {
        return [];
      }

      throw new Error(`Unexpected path: ${path}`);
    });

    render(
      <MemoryRouter initialEntries={["/event/event-1/settings"]}>
        <Routes>
          <Route path="/event/:id/settings" element={<EventSettingsPage />} />
          <Route path="/event/:id" element={<EventRedirectDestination />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("Gallery redirect /event/event-1?denied=1"),
      ).toBeInTheDocument();
    });
  });

  it("optimistically updates member roles while the patch request is in flight", async () => {
    const user = userEvent.setup();
    let resolvePatch: (() => void) | null = null;
    const patchPromise = new Promise((resolve) => {
      resolvePatch = () => resolve({});
    });

    mockedApiFetch.mockImplementation(async (path: string) => {
      if (path === "/api/events/event-1") {
        return {
          id: "event-1",
          name: "Launch Party",
          date: "2026-05-10",
          description: "Event details",
          expiresAt: "2026-06-09",
          status: "active",
          joinToken: "join-token",
          role: "creator",
          creator: { id: "creator-1", name: "Taylor" },
          counts: { allPhotos: 8, myPhotos: 1, members: 4 },
        };
      }

      if (path === "/api/events/event-1/members") {
        return [
          {
            id: "member-1",
            userId: "creator-1",
            name: "Taylor",
            email: "taylor@example.com",
            role: "creator",
            joinedAt: "2026-05-10T00:00:00.000Z",
          },
          {
            id: "member-2",
            userId: "user-2",
            name: "Alex",
            email: "alex@example.com",
            role: "member",
            joinedAt: "2026-05-10T00:00:00.000Z",
          },
        ];
      }

      if (path === "/api/events/event-1/members/user-2") {
        return patchPromise as Promise<unknown>;
      }

      throw new Error(`Unexpected path: ${path}`);
    });

    render(
      <MemoryRouter initialEntries={["/event/event-1/settings"]}>
        <Routes>
          <Route path="/event/:id/settings" element={<EventSettingsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Access and upload roles")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Make admin" }));

    expect(screen.getByRole("button", { name: "Remove admin" })).toBeInTheDocument();
    expect(mockedApiFetch).toHaveBeenCalledWith(
      "/api/events/event-1/members/user-2",
      expect.objectContaining({
        method: "PATCH",
        body: { role: "admin" },
      }),
    );

    resolvePatch?.();
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Remove admin" })).toBeInTheDocument();
    });
  });
});
