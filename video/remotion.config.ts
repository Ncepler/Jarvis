/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
// PNG frames, not JPEG: flat bone fields + thin type show JPEG ringing, and
// JPEG frames also forced a full-range yuvj420p file some apps wash out.
Config.setVideoImageFormat("png");
Config.setPixelFormat("yuv420p");
Config.setCrf(16);
Config.setOverwriteOutput(true);
// The showcase is WebGL (three.js + shaders). ANGLE works on a GPU and falls
// back to SwiftShader on GPU-less machines like the cloud container.
Config.setChromiumOpenGlRenderer("angle");
