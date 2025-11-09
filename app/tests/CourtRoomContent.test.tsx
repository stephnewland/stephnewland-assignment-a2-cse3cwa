// app/tests/CourtRoomContent.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import CourtRoomContent from "../../components/CourtRoomContent"; // relative import from test file

// Mock subcomponents with relative paths
jest.mock("../../components/MessageQueue", () => {
  const MessageQueueMock = () => (
    <div data-testid="message-queue">MessageQueue Active</div>
  );
  return MessageQueueMock;
});

jest.mock("../../components/Timer", () => {
  const TimerMock = () => <div data-testid="timer">Timer Running</div>;
  return TimerMock;
});

describe("CourtRoomContent", () => {
  test("renders all courtroom subcomponents", () => {
    render(<CourtRoomContent />);

    expect(screen.getByTestId("message-queue")).toBeInTheDocument();
    expect(screen.getByTestId("timer")).toBeInTheDocument();
  });

  test("renders courtroom heading", () => {
    render(<CourtRoomContent />);
    expect(
      screen.getByRole("heading", { name: /court room/i })
    ).toBeInTheDocument();
  });
});
