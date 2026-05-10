import path from "node:path";
import { defineConfig, loadEnv, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  
  // ✅ نشيل /api من الـ target عشان الـ rewrite يضيفه
  const apiTarget = (env.VITE_API_URL || "").replace(/\/api\/?$/, "").replace(/\/+$/, "");

  return {
    plugins: [
      {
        name: "vite-js-to-jsx",
        async transform(code, id) {
          if (!/src\/.*\.js$/.test(id)) return null;
          return transformWithEsbuild(code, id, {
            loader: "jsx",
            jsx: "automatic",
          });
        },
      },
      react(),
    ],
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          silenceDeprecations: ["legacy-js-api", "import", "slash-div", "color-functions", "global-builtin", "if-function"],
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "next/link": path.resolve(__dirname, "src/router/NextLinkCompat.tsx"),
        "next/router": path.resolve(__dirname, "src/router/useRouter.ts"),
        "next/image": path.resolve(__dirname, "src/components/common/AppImage.tsx"),
        "next/head": path.resolve(__dirname, "src/router/HeadCompat.tsx"),
        "next/dynamic": path.resolve(__dirname, "src/router/dynamic.tsx"),
      },
    },
    server: apiTarget
      ? {
          proxy: {
            "/api/proxy": {
              target: apiTarget,
              changeOrigin: true,
              secure: false,
              // ✅ /api/proxy/blogs → /api/blogs
              rewrite: (p) => p.replace(/^\/api\/proxy/, "/api"),
              cookieDomainRewrite: "",
            },
          },
        }
      : undefined,
    preview: apiTarget
      ? {
          proxy: {
            "/api/proxy": {
              target: apiTarget,
              changeOrigin: true,
              secure: false,
              rewrite: (p) => p.replace(/^\/api\/proxy/, "/api"),
              cookieDomainRewrite: "",
            },
          },
        }
      : undefined,
  };
});