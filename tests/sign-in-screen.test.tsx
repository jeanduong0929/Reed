import React from "react";
import { act, create } from "react-test-renderer";
import { beforeEach, describe, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  platformState: {
    os: "ios",
  },
  coolDownAsync: vi.fn(),
  makeRedirectUri: vi.fn(() => "reed://auth"),
  routerReplace: vi.fn(),
  startSSOFlow: vi.fn(),
  warmUpAsync: vi.fn(),
}));

vi.mock("@clerk/expo", () => ({
  useSSO: () => ({
    startSSOFlow: mocks.startSSOFlow,
  }),
}));

vi.mock("expo-auth-session", () => ({
  makeRedirectUri: mocks.makeRedirectUri,
}));

vi.mock("expo-router", () => ({
  useRouter: () => ({
    replace: mocks.routerReplace,
  }),
}));

vi.mock("expo-web-browser", () => ({
  coolDownAsync: mocks.coolDownAsync,
  maybeCompleteAuthSession: vi.fn(),
  warmUpAsync: mocks.warmUpAsync,
}));

vi.mock("react-native", async () => {
  const React = await import("react");

  return {
    Platform: {
      get OS() {
        return mocks.platformState.os;
      },
    },
    Pressable: (props: Record<string, unknown>) =>
      React.createElement("pressable", props),
    Text: (props: Record<string, unknown>) => React.createElement("text", props),
    View: (props: Record<string, unknown>) => React.createElement("view", props),
  };
});

vi.mock("react-native-safe-area-context", async () => {
  const React = await import("react");

  return {
    SafeAreaView: (props: Record<string, unknown>) =>
      React.createElement("safe-area-view", props),
  };
});

import SignInScreen from "@/app/(auth)/sign-in";

describe("SignInScreen", () => {
  beforeEach(() => {
    mocks.platformState.os = "ios";
    mocks.coolDownAsync.mockReset();
    mocks.makeRedirectUri.mockReset();
    mocks.makeRedirectUri.mockReturnValue("reed://auth");
    mocks.routerReplace.mockReset();
    mocks.startSSOFlow.mockReset();
    mocks.warmUpAsync.mockReset();
  });

  test("starts Google OAuth with the native redirect URI", async () => {
    mocks.startSSOFlow.mockResolvedValue({});

    let renderer: ReturnType<typeof create>;

    await act(async () => {
      renderer = create(<SignInScreen />);
    });

    const button = renderer!.root.find(
      (node) => typeof node.props.onPress === "function",
    );

    await act(async () => {
      await button.props.onPress();
    });

    expect(mocks.makeRedirectUri).toHaveBeenCalledTimes(1);
    expect(mocks.startSSOFlow).toHaveBeenCalledWith({
      strategy: "oauth_google",
      redirectUrl: "reed://auth",
    });
  });

  test("activates the session and navigates to home after Google sign-in", async () => {
    const setActive = vi.fn();
    mocks.startSSOFlow.mockResolvedValue({
      createdSessionId: "sess_123",
      setActive,
    });

    let renderer: ReturnType<typeof create>;

    await act(async () => {
      renderer = create(<SignInScreen />);
    });

    const button = renderer!.root.find(
      (node) => typeof node.props.onPress === "function",
    );

    await act(async () => {
      await button.props.onPress();
    });

    expect(setActive).toHaveBeenCalledTimes(1);

    const args = setActive.mock.calls[0][0] as {
      navigate: (input: {
        decorateUrl: (path: string) => string;
        session: { currentTask?: string } | null;
      }) => Promise<void>;
      session: string;
    };

    expect(args.session).toBe("sess_123");

    await args.navigate({
      decorateUrl: (path) => `decorated:${path}`,
      session: null,
    });

    expect(mocks.routerReplace).toHaveBeenCalledWith("decorated:/");
  });

  test("does not navigate away while Clerk has a pending session task", async () => {
    const setActive = vi.fn();
    mocks.startSSOFlow.mockResolvedValue({
      createdSessionId: "sess_123",
      setActive,
    });

    let renderer: ReturnType<typeof create>;

    await act(async () => {
      renderer = create(<SignInScreen />);
    });

    const button = renderer!.root.find(
      (node) => typeof node.props.onPress === "function",
    );

    await act(async () => {
      await button.props.onPress();
    });

    const args = setActive.mock.calls[0][0] as {
      navigate: (input: {
        decorateUrl: (path: string) => string;
        session: { currentTask?: string } | null;
      }) => Promise<void>;
    };

    await args.navigate({
      decorateUrl: (path) => `decorated:${path}`,
      session: { currentTask: "complete_profile" },
    });

    expect(mocks.routerReplace).not.toHaveBeenCalled();
  });

  test("warms up the browser on Android and cools it down on unmount", async () => {
    mocks.platformState.os = "android";

    let renderer: ReturnType<typeof create>;

    await act(async () => {
      renderer = create(<SignInScreen />);
    });

    expect(mocks.warmUpAsync).toHaveBeenCalledTimes(1);

    await act(async () => {
      renderer!.unmount();
    });

    expect(mocks.coolDownAsync).toHaveBeenCalledTimes(1);
  });
});
