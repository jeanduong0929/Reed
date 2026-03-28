import React from "react";
import { act, create } from "react-test-renderer";
import { beforeEach, describe, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  authState: {
    isAuthenticated: false,
    isLoading: true,
  },
  syncUser: vi.fn<() => Promise<null>>(),
}));

vi.mock("convex/react", () => ({
  useConvexAuth: () => mocks.authState,
  useMutation: () => mocks.syncUser,
}));

vi.mock("expo-router", async () => {
  const React = await import("react");

  return {
    Redirect: (props: Record<string, unknown>) =>
      React.createElement("redirect", props),
    Stack: (props: Record<string, unknown>) => React.createElement("stack", props),
  };
});

import HomeLayout from "@/app/(home)/_layout";

describe("HomeLayout", () => {
  beforeEach(() => {
    mocks.authState.isAuthenticated = false;
    mocks.authState.isLoading = true;
    mocks.syncUser.mockReset();
    mocks.syncUser.mockResolvedValue(null);
  });

  test("renders nothing while Convex auth is loading", async () => {
    let renderer: ReturnType<typeof create>;

    await act(async () => {
      renderer = create(<HomeLayout />);
    });

    expect(renderer!.toJSON()).toBeNull();
    expect(mocks.syncUser).not.toHaveBeenCalled();
  });

  test("redirects unauthenticated users to sign-in", async () => {
    mocks.authState.isLoading = false;

    let renderer: ReturnType<typeof create>;

    await act(async () => {
      renderer = create(<HomeLayout />);
    });

    const redirect = renderer!.root.find(
      (node) => node.props.href === "/(auth)/sign-in",
    );

    expect(redirect.props.href).toBe("/(auth)/sign-in");
    expect(mocks.syncUser).not.toHaveBeenCalled();
  });

  test("renders the home stack and syncs the user after auth resolves", async () => {
    let renderer: ReturnType<typeof create>;

    await act(async () => {
      renderer = create(<HomeLayout />);
    });

    expect(mocks.syncUser).not.toHaveBeenCalled();

    mocks.authState.isLoading = false;
    mocks.authState.isAuthenticated = true;

    await act(async () => {
      renderer!.update(<HomeLayout />);
    });

    const stack = renderer!.root.find(
      (node) => node.props.screenOptions?.headerShown === false,
    );

    expect(stack.props.screenOptions).toEqual({
      headerShown: false,
    });
    expect(mocks.syncUser).toHaveBeenCalledTimes(1);
  });
});
