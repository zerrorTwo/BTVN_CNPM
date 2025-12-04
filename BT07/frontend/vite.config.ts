import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'BT07CartLibrary',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'es.js' : 'js'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@apollo/client', 'antd', 'graphql'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@apollo/client': 'ApolloClient',
          antd: 'antd',
          graphql: 'graphql',
        },
      },
    },
  },
});
