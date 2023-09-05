import { defineConfig,loadEnv  } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';
// https://vitejs.dev/config/
export default ({mode})=>{
  const root = process.cwd();
  const env = loadEnv(mode, root);
  return defineConfig({
    plugins: [vue()],
    resolve: {
      alias:{
        '@': resolve( __dirname, './src' )
      }
    },
    server: {
      host:'localhost',
      port: 8080,
      proxy:{
        [env.VITE_BASE_API]:{
          target:'http://127.0.0.1:3001',
          changeOrigin:true,
          ws: true,
          pathRewrite: {
            ['^' + env.VITE_BASE_API]: '' // 代理的路径
          }
        }
      }
    },
  })
} 


