import * as esbuild from 'esbuild-wasm';
import axios from 'axios'; 
import localForage from 'localforage'; 

const fileCache = localForage.createInstance({
  name: 'fileCacher'
});
    /**********
    (async () => {
      await fileCache.setItem( 'color', 'red') // stores info in an index db instance under the key of color 

      const color = await fileCache.getItem('color');  // retreives info for the item via the keyname 

      console.log(color);
    })()
    **********/
export const unpkgPathPlugin = (inputCode: string) => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResolve', args);
        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'a' };
        } 

        if (args.path.includes('./') || args.path.includes('../')) {
          return {
            namespace: 'a', 
            path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/').href
          };
        }

        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`
        }
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('onLoad', args);

        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: inputCode,
          };
        }
        // Check to see if we have already fetched this file & if it is already in the cache
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);
        // if it is, return it immediately
        if (cachedResult) {
          return cachedResult;
        }
        //otherwise
        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult  = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };
        // then store the responses in cache
        await fileCache.setItem(args.path, result) 

        return result;
      });
    },
  };
};
