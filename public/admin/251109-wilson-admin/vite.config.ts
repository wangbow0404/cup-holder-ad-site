// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Vite 기본 확장자에 맞추되, 명시적으로 포함
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    alias: {
      // ✅ 프로젝트 절대경로 별칭
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build',
  },
  server: {
    port: 3000,
    open: true,
    // 개발 중 화면 가리는 에러 오버레이가 거슬리면 아래 주석 해제
    // hmr: { overlay: false },
  },
});
