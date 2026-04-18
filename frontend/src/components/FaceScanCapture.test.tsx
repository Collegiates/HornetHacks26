import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { FaceScanCapture } from "./FaceScanCapture";

describe("FaceScanCapture", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "mediaDevices", {
      writable: true,
      value: {
        getUserMedia: vi.fn().mockResolvedValue({
          getTracks: () => [{ stop: vi.fn() }],
        }),
      },
    });

    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      drawImage: vi.fn(),
    } as never);

    vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation((callback) => {
      callback?.(new Blob(["face"], { type: "image/jpeg" }));
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("captures and confirms a selfie", async () => {
    const user = userEvent.setup();
    const onCapture = vi.fn().mockResolvedValue(undefined);

    render(<FaceScanCapture onCapture={onCapture} onSkip={vi.fn()} />);

    await user.click(await screen.findByRole("button", { name: /take photo/i }));
    await user.click(screen.getByRole("button", { name: /looks good/i }));

    await waitFor(() => {
      expect(onCapture).toHaveBeenCalledTimes(1);
    });
  });

  it("supports skipping the face scan", async () => {
    const user = userEvent.setup();
    const onSkip = vi.fn().mockResolvedValue(undefined);

    render(<FaceScanCapture onCapture={vi.fn()} onSkip={onSkip} />);

    await user.click(screen.getByRole("button", { name: /skip for now/i }));

    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it("shows a camera access fallback when permission is denied", async () => {
    Object.defineProperty(navigator, "mediaDevices", {
      writable: true,
      value: {
        getUserMedia: vi.fn().mockRejectedValue(new Error("Permission denied")),
      },
    });

    render(<FaceScanCapture onCapture={vi.fn()} onSkip={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText("Permission denied")).toBeInTheDocument();
    });
  });
});
