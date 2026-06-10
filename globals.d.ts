// VS Code's bundled TypeScript (5.9+) flags side-effect CSS imports with
// TS2882 in layout.tsx; CLI tsc doesn't. This declaration satisfies both.
declare module "*.css";
