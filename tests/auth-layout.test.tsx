import React from "react";
import { act, create } from "react-test-renderer";
import { beforeEach, describe, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  authState: {
    isAuthenticated: false,
    isLoading: true,
  },
  clerkState: {
    isLoaded: true,
    isSignedIn: false,
  },
}));

vi.mock("convex/react", () => ({
  useConvexAuth: () => mocks.authState,
}));

vi.mock("@clerk/expo", () => ({
  useAuth: () => mocks.clerkState,
}));

vi.mock("expo-router", async () => {
  const React = await import("react");

  return {
    Redirect: (props: Record<string, unknown>) =>
      React.createElement("redirect", props),
    Stack: (props: Record<string, unknown>) => React.createElement("stack", props),
  };
});

import AuthLayout from "@/app/(auth)/_layout";

describe("AuthLayout", () => {
  beforeEach(() => {
    mocks.authState.isAuthenticated = false;
    mocks.authState.isLoading = true;
    mocks.clerkState.isLoaded = true;
    mocks.clerkState.isSignedIn = false;
  });

  test("renders nothing while Convex auth is loading", async () => {
    let renderer: ReturnType<typeof create>;

    await act(async () => {
      renderer = create(<AuthLayout />);
    });

    expect(renderer!.toJSON()).toBeNull();
  });

  test("redirects only Convex-authenticated users to home", async () => {
    mocks.authState.isLoading = false;
    mocks.authState.isAuthenticated = true;

    let renderer: ReturnType<typeof create>;

    await act(async () => {
      renderer = create(<AuthLayout />);
    });

    const redirect = renderer!.root.find((node) => node.props.href === "/(home)");

    expect(redirect.props.href).toBe("/(home)");
  });

  test("renders the auth stack when Convex auth reports signed out", async () => {
    mocks.authState.isLoading = false;

    let renderer: ReturnType<typeof create>;

    await act(async () => {
      renderer = create(<AuthLayout />);
    });

    const stack = renderer!.root.find(
      (node) => node.props.screenOptions?.headerShown === false,
    );

    expect(stack.props.screenOptions).toEqual({
      headerShown: false,
    });
  });
});
