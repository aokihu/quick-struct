/**
 * This script file used to generate build code
 * with ESbuild
 *
 * @author aokihu <aokihu@gmail.com>
 */

require("esbuild")
  .build({
    entryPoints: ["src/index.ts"],
    outfile: "build/index.js",
    bundle: true,
    minify: true,
    platform: "node",
    target: ["node16"],
    legalComments: "none",
    metafile: true,
    treeShaking: true,
  })
  .then((result) => console.log(result.metafile))
  .catch(() => process.exit(1));
