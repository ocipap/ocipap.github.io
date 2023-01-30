---
title: Next.js config
tags:
- React
- Nextjs
- config
---

### base path 

sub-path 도메인으로 어플리케이션을 서빙하고 싶을때 basePath 옵션을 통해 sub-path 를 설정할 수 있다.

```js
module.exports = {
  basePath: '/new'
}
```

> nextjs 의 base path 설정으로 인해 `mockServiceWorker.js` 를 불러오지 못함

[관련 링크](https://github.com/mswjs/msw/issues/690#issuecomment-849552403)

```js
// next.config.js
module.exports = {
  basePath: '/prefix',
  async headers() {
    return [
      {
        // Append the "Service-Worker-Allowed" header
        // to each response, overriding the default worker's scope.
        source: '/(.*)',
        headers: [
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ]
  },
}

// ...

worker.start({
  serviceWorker: {
    // Specify the worker script URL relative to the _root_.
    url: '/prefix/mockServiceWorker.js',
    options: {
      // Override the scope to the root ("/").
      // By default, the worker is scoped to its location on your server,
      // which in this case would be "/prefix".
      scope: '/',
    },
  },
})
```

### rewrites
















