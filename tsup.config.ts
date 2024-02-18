import { defineConfig } from "tsup";

export default defineConfig({
    format: ['cjs', 'esm'],
    entry: ['./src/utils.ts', './src/services.ts'],
    dts: true,
    shims: true,
    skipNodeModulesBundle: true,
    clean: true,
})