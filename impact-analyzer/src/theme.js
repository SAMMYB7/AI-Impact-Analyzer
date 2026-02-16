import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  ...defaultConfig,
  theme: {
    ...defaultConfig.theme,
    tokens: {
      ...defaultConfig.theme?.tokens,
      colors: {
        ...defaultConfig.theme?.tokens?.colors,
        navy: {
          50: { value: "#e6eaf2" },
          100: { value: "#c0c9de" },
          200: { value: "#97a6c8" },
          300: { value: "#6d83b2" },
          400: { value: "#4e69a2" },
          500: { value: "#2f4f91" },
          600: { value: "#294889" },
          700: { value: "#223f7e" },
          800: { value: "#1b3674" },
          900: { value: "#0f1b2e" },
          950: { value: "#0a1120" },
        },
        brand: {
          50: { value: "#e0f7fa" },
          100: { value: "#b2ebf2" },
          200: { value: "#80deea" },
          300: { value: "#4dd0e1" },
          400: { value: "#26c6da" },
          500: { value: "#00bcd4" },
          600: { value: "#00acc1" },
          700: { value: "#0097a7" },
          800: { value: "#00838f" },
          900: { value: "#006064" },
        },
      },
    },
  },
});

export const system = createSystem(config);
