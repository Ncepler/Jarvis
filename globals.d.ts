// VS Code's bundled TypeScript (5.9+) flags side-effect CSS imports with
// TS2882 in layout.tsx; CLI tsc doesn't. This declaration satisfies both.
declare module "*.css";

// three@0.186.0 ships zero .d.ts files and no "types" entry in its package
// exports map — DefinitelyTyped's @types/three is the normal companion for
// this, but that's a third dependency the fractured-hero task's scope
// explicitly capped at two (three + @react-three/fiber). This trades away
// type-checking on the `three` API surface itself (everything comes back
// `any`) to stay inside that limit — flagged for Noah; installing
// @types/three later and deleting this line restores full typing.
declare module "three";
