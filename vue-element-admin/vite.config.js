import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';
// https://vitejs.dev/config/
export default ({ mode }) => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  return defineConfig({
    plugins: [vue()
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    // css: {
    //   preprocessorOptions: {
    //     scss: {
    //       additionalData: `@import '@/assets/style/base.scss';`
    //     }
    //   }
    // },
    server: {
      host: '0.0.0.0',
      port: 8081,
      proxy: {
        [env.VITE_BASE_API]: {
          target: env.VITE_NETWORK_API,
          changeOrigin: true,
          ws: true,
          pathRewrite: {
            ['^' + env.VITE_BASE_API]: '' // 代理的路径
          }
        },
        [env.VITE_MOCK_API]: {
          target: "http://api-manager.marsview.cc",
          changeOrigin: true,
          ws: true,
          pathRewrite: {
            ['^' + env.VITE_MOCK_API]: '' // 代理的路径
          }
        }
      }
    },
  })
}


