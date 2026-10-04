import { useSyncExternalStore } from "react";

/**
 * A minimal external store, shared between the DOM UI and the R3F scenes
 * (which render in a separate React root and can't see DOM-side context).
 */
export type Store<T> = {
  get: () => T;
  set: (patch: Partial<T> | ((state: T) => Partial<T>)) => void;
  subscribe: (listener: () => void) => () => void;
};

export const createStore = <T extends object>(initial: T): Store<T> => {
  let state = initial;
  const listeners = new Set<() => void>();

  return {
    get: () => state,
    set: (patch) => {
      const next = typeof patch === "function" ? patch(state) : patch;
      state = { ...state, ...next };
      listeners.forEach((l) => l());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
};

export const useStore = <T extends object, S>(store: Store<T>, selector: (state: T) => S, serverValue: S): S =>
  useSyncExternalStore(
    store.subscribe,
    () => selector(store.get()),
    () => serverValue
  );

/* ---------- Custom cursor ---------- */

export type CursorVariant = "default" | "link" | "view" | "drag" | "core" | "hidden";

/** `scene` is set by 3D objects and wins over `dom` (set by hovered elements). */
export const cursorStore = createStore<{
  dom: { variant: CursorVariant; label: string };
  scene: { variant: CursorVariant; label: string } | null;
}>({
  dom: { variant: "default", label: "" },
  scene: null,
});

export const setSceneCursor = (variant: CursorVariant | null, label = "") =>
  cursorStore.set({ scene: variant ? { variant, label } : null });

/* ---------- Loader ---------- */

/** Named tasks the loader waits for; `true` once complete. */
export const loaderStore = createStore<{ tasks: Record<string, boolean>; done: boolean }>({
  tasks: {},
  done: false,
});

export const registerTask = (name: string) =>
  loaderStore.set((s) => (name in s.tasks ? {} : { tasks: { ...s.tasks, [name]: false } }));

export const completeTask = (name: string) =>
  loaderStore.set((s) => ({ tasks: { ...s.tasks, [name]: true } }));

/* ---------- Work gallery hover (drives the WebGL distortion overlay) ---------- */

export const workHoverStore = createStore<{
  /** The hovered card's image frame, or null. */
  el: HTMLElement | null;
  src: string;
  /** Pointer position inside the frame, uv space (0..1, y up). */
  mouse: [number, number];
}>({ el: null, src: "", mouse: [0.5, 0.5] });
