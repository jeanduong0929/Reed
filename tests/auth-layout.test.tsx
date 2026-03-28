import React from "react";
import { act, create } from "react-test-renderer";
import { beforeEach, describe, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  authState: {
    isLoaded: false,
    isSignedIn: false,
  },
}));

vi.mock("@clerk/expo", () => ({
  useAuth: () => mocks.authState,
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
    mocks.authState.isLoaded = false;
    mocks.authState.isSignedIn = false;
  });

  test("renders nothing while Clerk auth is loading", async () => {
    let renderer: ReturnType<typeof create>;

    await act(async () => {
      renderer = create(<AuthLayout />);
    });

    expect(renderer!.toJSON()).toBeNull();
  });

  test("redirects signed-in users to home", async () => {
    mocks.authState.isLoaded = true;
    mocks.authState.isSignedIn = true;

    let renderer: ReturnType<typeof create>;

    await act(async () => {
      renderer = create(<AuthLayout />);
    });

    const redirect = renderer!.root.find((node) => node.props.href === "/(home)");

    expect(redirect.props.href).toBe("/(home)");
  });

  test("renders the auth stack when signed out", async () => {
    mocks.authState.isLoaded = true;

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
