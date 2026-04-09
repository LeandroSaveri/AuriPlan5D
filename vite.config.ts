/**
* Configuração Vite para o frontend AuriPlan.

* Esta configuração configura:

* - Suporte React via @vitejs/plugin-react

* - Integração Tailwind CSS

* - Alias de caminho para a arquitetura interna do projeto

* - Divisão otimizada de pedaços do fornecedor para um carregamento mais rápido

* - Configuração do servidor de desenvolvimento
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const rawPort = process.env.PORT;
const port = rawPort ? Number(rawPort) : 5173;
const basePath = process.env.BASE_PATH || "/auriplan/";

const srcDir = path.resolve(import.meta.dirname, "src");

export default defineConfig({
  base: basePath,

  plugins: [
    react(),
    tailwindcss()
  ],

  resolve: {
    alias: {
      "@": srcDir,
      "@app": path.resolve(srcDir, "app"),
      "@core": path.resolve(srcDir, "core"),
      "@engine": path.resolve(srcDir, "engine"),
      "@editor": path.resolve(srcDir, "editor"),
      "@features": path.resolve(srcDir, "features"),
      "@components": path.resolve(srcDir, "components"),
      "@ui": path.resolve(srcDir, "components/ui"),
      "@store": path.resolve(srcDir, "store"),
      "@model": path.resolve(srcDir, "model"),
      "@services": path.resolve(srcDir, "services"),
      "@hooks": path.resolve(srcDir, "hooks"),
      "@utils": path.resolve(srcDir, "utils"),
      "@auriplan-types": path.resolve(srcDir, "types"),
      "@workers": path.resolve(srcDir, "workers"),
      "@assets": path.resolve(srcDir, "assets"),
      "@library": path.resolve(srcDir, "library"),
      "@ar": path.resolve(srcDir, "ar"),
      "@rendering": path.resolve(srcDir, "rendering"),
      "@export": path.resolve(srcDir, "export"),
      "@config": path.resolve(srcDir, "config"),
      "@i18n": path.resolve(srcDir, "i18n"),
    },
    dedupe: ["react", "react-dom", "three"],
  },

  root: path.resolve(import.meta.dirname),

  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV !== "production",

    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "three-vendor": ["three", "@react-three/fiber", "@react-three/drei"],
          "ui-vendor": ["framer-motion", "lucide-react"],
          "state-vendor": ["zustand", "immer"],
        },
      },
    },

    chunkSizeWarningLimit: 1500,
  },

  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: { strict: false, deny: ["**/.*"] },
  },

  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },

  optimizeDeps: {
    include: ["three", "@react-three/fiber", "@react-three/drei"],
  },
});
