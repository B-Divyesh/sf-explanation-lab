import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    assetsDir: 'build',
    rollupOptions: {input: ['index.html', '404.html']}
  }
});
