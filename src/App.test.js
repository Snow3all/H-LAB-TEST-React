import React from 'react';
import { render, screen } from '@testing-library/react';
import UserProfile from "../src/App";

global.fetch = jest.fn();

describe("UserProfile", () => {
  const userId = "123";

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially", () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    );

    render(<UserProfile userId={userId} />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("displays user data when fetched successfully", async () => {
    const mockUserData = { id: userId, name: "John Doe" };
    fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(mockUserData) })
    );

    render(<UserProfile userId={userId} />);

    await screen.findByText(/john doe/i);
  });

  test("displays an error message when fetch fails", async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({ ok: false }));

    render(<UserProfile userId={userId} />);

    await screen.findByText(/failed to fetch user data/i);
  });

  test("displays an error message when there is a network error", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.reject(new Error("Network Error"))
    );

    render(<UserProfile userId={userId} />);

    await screen.findByText(/network error/i);
  });
});
