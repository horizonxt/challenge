import path from 'path';

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: id => {
                    if (id.includes('node_modules')) {
                        return id.split('/node_modules/')[1].split('/')[0];
                    }
                    if (id.includes('src/pages/')) {
                        const match = id.match(/src\/pages\/(.*)\//);
                        return match ? match[1] : 'main';
                    }
                },
                chunkFileNames: '[hash].js' // Only include the hash in the chunk file names
            }
        }
    },
    define: {
        'process.env': {
            BACKEND_URL: 'http://127.0.0.1:5000'
        }
    },
    resolve: {
        alias: { '@': path.resolve(__dirname, 'src') }
    }
});
