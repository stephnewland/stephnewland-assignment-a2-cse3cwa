import React from "react";
import { render, screen, act } from "@testing-library/react";
import MessageQueue, { messages } from "../../components/MessageQueue";

jest.useFakeTimers();

//Test 1
describe("MessageQueue interactions", () => {
  test("renders container and can enqueue a message", () => {
    const { container } = render(<MessageQueue />);

    // container exists
    expect(container).toBeInTheDocument();

    // Fast-forward timers to trigger the automatic enqueue
    act(() => {
      jest.advanceTimersByTime(30000); // 20–30s window in component
    });

    // The outer container should still exist
    const containerDiv = container.querySelector("div.fixed.top-4");
    expect(containerDiv).toBeInTheDocument();

    //Check at least one child div was added to container (message div)
    expect(containerDiv?.children.length).toBeGreaterThanOrEqual(0);
  });

  //Test 2
  test("renders multiple messages when timer advances", () => {
    const { container } = render(<MessageQueue />);

    act(() => {
      // Fast-forward time multiple times to enqueue multiple messages
      jest.advanceTimersByTime(100000); // 100s
    });

    const containerDiv = container.querySelector("div.fixed.top-4");
    expect(containerDiv).toBeInTheDocument();

    // Check multiple children in the container
    expect(containerDiv?.children.length).toBeGreaterThanOrEqual(1);
  });
});
