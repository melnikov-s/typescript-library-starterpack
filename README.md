# typescript-library-starterpack

An opinionated starter pack for a typescript library, comes with rollup for bundling, jest configured for testing and prettier+eslint+vscode config for formatting and styling.

`npm install -g @melnikov-s/tslsp`

`tslsp libraryName`

Will create folder `libraryName` with all the scaffolding code required for your typescript library.

- All `strict` checks will be turned on.
- Rollup will be used to bundle the library.
- eslint and prettier pre-configured for auto formatting with vscode.
- jest used for unit tests
- by default will output UMD ES5 bundle (no polyfills)

Available `npm run` commands:

```
  test
    jest
  test:watch
    jest --watch
  test:cover
    jest --coverage
  build
    rollup -c rollup.config.js
  lint
    eslint ./src ./tests --ext .ts
```
