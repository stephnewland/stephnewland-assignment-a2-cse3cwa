import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TabGenerator from "@components/TabGenerator";

// Mock fetch for saveOutput API call
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ id: 123 }),
  })
) as jest.Mock;

describe("TabGenerator Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Autogenerate tabs for 1, 3, 5 demo presets", async () => {
    render(<TabGenerator />);

    const oneTabBtn = screen.getByRole("button", { name: /1 Tab/i });
    const threeTabBtn = screen.getByRole("button", { name: /3 Tabs/i });
    const fiveTabBtn = screen.getByRole("button", { name: /5 Tabs/i });

    // 1 tab
    userEvent.click(oneTabBtn);
    await waitFor(() => {
      const tabs = screen.getAllByRole("tab");
      expect(tabs.length).toBe(1);
      expect(tabs[0]).toHaveTextContent("Step 1");
    });

    // 3 tabs
    userEvent.click(threeTabBtn);
    await waitFor(() => {
      const tabs = screen.getAllByRole("tab");
      expect(tabs.length).toBe(3);
      expect(tabs.map((t) => t.textContent)).toEqual([
        "Step 1",
        "Step 2",
        "Step 3",
      ]);
    });

    // 5 tabs
    userEvent.click(fiveTabBtn);
    await waitFor(() => {
      const tabs = screen.getAllByRole("tab");
      expect(tabs.length).toBe(5);
      expect(tabs.map((t) => t.textContent)).toEqual([
        "Step 1",
        "Step 2",
        "Step 3",
        "Step 4",
        "Step 5",
      ]);
    });
  });

  test("Save Output button sends POST request with generated HTML", async () => {
    render(<TabGenerator />);

    // Preload 3 tabs for this test
    const threeTabBtn = screen.getByRole("button", { name: /3 Tabs/i });
    userEvent.click(threeTabBtn);

    // Click Save Output button
    const saveBtn = screen.getByRole("button", { name: /Save Output/i });
    userEvent.click(saveBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      expect(fetchCall[0]).toBe("/api/output");
      expect(fetchCall[1]?.method).toBe("POST");

      const body = JSON.parse(fetchCall[1]?.body);
      expect(body.title).toBe("Generated Tabs Output");
      expect(body.content).toContain("<!DOCTYPE html>");
      expect(body.content).toContain("Step 1");
      expect(body.content).toContain("Step 2");
      expect(body.content).toContain("Step 3");
    });
  });
});
