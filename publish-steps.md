## Publish steps

1. Create feature branch and complete the development
2. Confirm all tests passed
    ```console
    $ npm run test
    ```
3. Update version in package.json
4. Build
    ```console
    $ npm run build
    ```
5. Copy and paste the API signature from `dist/*.d.ts` README.md
6. Push branch and merge main
7. Publish
```console
$ npm publish
```
8. Confirm version is updated in npm website (https://www.npmjs.com/package/jyoo-lib-ts)
