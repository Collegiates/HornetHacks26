import "@testing-library/jest-dom/vitest";

Object.defineProperty(globalThis, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
});

Object.defineProperty(globalThis, "ResizeObserver", {
  writable: true,
  value: class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
});

Object.defineProperty(globalThis.URL, "createObjectURL", {
  writable: true,
  value: vi.fn(() => "blob:preview"),
});

Object.defineProperty(globalThis.URL, "revokeObjectURL", {
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(navigator, "clipboard", {
  configurable: true,
  writable: true,
  value: {
    writeText: vi.fn(),
  },
});
