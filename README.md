# Next oAuth

This is a Demo project to implement an oAuth library in NextJS. This example shows an oAuth journey with StackOverflow and Github.

The library itself is in `pages/api/[route]/[api]/oath.ts`. Ideally, this would come as an npm package.

Data is requested from an api which redirects the user to Github and takes the code query param upon redirect to exchange it with an access token which is then used to get the user's data and returned to the client.

Environment variables required:

- NEXT_PUBLIC_DOMAIN
- STACK_APP_KEY
- STACK_APP_CLIENT_ID
- STACK_APP_CLIENT_SECRET

DEMO: https://t6emtg-3000.preview.csb.app/

![Image](./oauth.png "demo oauth library")
