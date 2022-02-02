import * as esbuild from 'esbuild-wasm';

    /**********
    (async () => {
      await fileCache.setItem( 'color', 'red') // stores info in an index db instance under the key of color 

      const color = await fileCache.getItem('color');  // retreives info for the item via the keyname 

      console.log(color);
    })()
    **********/
export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // Handle root entry file of 'index.js'
      build.onResolve({ filter: /(^index\.js$)/ }, ()=> {
        return { path: 'index.js', namespace: 'a'};
      }); 
      // Handle relative paths in a module
      build.onResolve({ filter: /^\.+\//}, (args: any) => {
      return {
        namespace: 'a',
        path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/')
          .href,
      };
      })
      // Handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`
        }
      });


    },
  };
};
