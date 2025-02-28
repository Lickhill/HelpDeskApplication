import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	build: {
		outDir: "dist",
		sourcemap: true,
	},
	server: {
		port: 5173,
		proxy: {
			"/api": {
				target: process.env.VITE_API || "http://localhost:5000",
				changeOrigin: true,
				secure: false,
			},
		},
	},
});
