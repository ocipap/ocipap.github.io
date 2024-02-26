---
title: shaka fullscreen polyfill 코드 분석
tags:
  - library
  - shaka-player
  - polyfill
---

플레이어 fullscreen 작업 중, shaka-player 의 polyfill/fullscreen.js 를 보았고 해당 코드를 분석해보니 각각의 브라우져별로 fullscreen API 가 다르게 동작하는 것을 확인할 수 있었다.

## `lib/polyfill/fullscreen.js` 전체 코드

```javascript
/*! @license
 * Shaka Player
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
goog.provide('shaka.polyfill.Fullscreen');
goog.require('shaka.polyfill');
/**
 * @summary A polyfill to unify fullscreen APIs across browsers.
 * Many browsers have prefixed fullscreen methods on Element and document.
 * See {@link https://mzl.la/2K0xcHo Using fullscreen mode} on MDN for more
 * information.
 * @export
 */
shaka.polyfill.Fullscreen = class {
  /**
   * Install the polyfill if needed.
   * @export
   */
  static install() {
    if (!window.Document) {
      // Avoid errors on very old browsers.
      return;
    }
    // eslint-disable-next-line no-restricted-syntax
    let proto = Element.prototype;
    proto.requestFullscreen = proto.requestFullscreen ||
                              proto.mozRequestFullScreen ||
                              proto.msRequestFullscreen ||
                              proto.webkitRequestFullscreen;
    // eslint-disable-next-line no-restricted-syntax
    proto = Document.prototype;
    proto.exitFullscreen = proto.exitFullscreen ||
                           proto.mozCancelFullScreen ||
                           proto.msExitFullscreen ||
                           proto.webkitCancelFullScreen;
    if (!('fullscreenElement' in document)) {
      Object.defineProperty(document, 'fullscreenElement', {
        get: () => {
          return document.mozFullScreenElement ||
                 document.msFullscreenElement ||
                 document.webkitCurrentFullScreenElement ||
                 document.webkitFullscreenElement;
        },
      });
      Object.defineProperty(document, 'fullscreenEnabled', {
        get: () => {
          return document.mozFullScreenEnabled ||
                 document.msFullscreenEnabled ||
                 document.webkitFullscreenEnabled;
        },
      });
    }
    const proxy = shaka.polyfill.Fullscreen.proxyEvent_;
    document.addEventListener('webkitfullscreenchange', proxy);
    document.addEventListener('webkitfullscreenerror', proxy);
    document.addEventListener('mozfullscreenchange', proxy);
    document.addEventListener('mozfullscreenerror', proxy);
    document.addEventListener('MSFullscreenChange', proxy);
    document.addEventListener('MSFullscreenError', proxy);
  }
  /**
   * Proxy fullscreen events after changing their name.
   * @param {!Event} event
   * @private
   */
  static proxyEvent_(event) {
    const eventType = event.type.replace(/^(webkit|moz|MS)/, '').toLowerCase();
    const newEvent = document.createEvent('Event');
    newEvent.initEvent(eventType, event.bubbles, event.cancelable);
    event.target.dispatchEvent(newEvent);
  }
};
shaka.polyfill.register(shaka.polyfill.Fullscreen.install);
```

## `requestFullscreen`, `exitFullscreen` 재정의

```javascript
let proto = Element.prototype;
proto.requestFullscreen = proto.requestFullscreen ||
                          proto.mozRequestFullScreen ||
                          proto.msRequestFullscreen ||
                          proto.webkitRequestFullscreen;
// eslint-disable-next-line no-restricted-syntax
proto = Document.prototype;
proto.exitFullscreen = proto.exitFullscreen ||
                       proto.mozCancelFullScreen ||
                       proto.msExitFullscreen ||
                       proto.webkitCancelFullScreen;
```

각각의 브라우져에 맞는 fullscreen API 를 재정의했다. 따라서 사용하는 측에서는 브라우져별로 API 가 존재하는지 체크하는 별도의 조치가 필요하지 않다.

## document 의 `fullscreenElement`, `fullscreenEnabled` 재정의

```javascript
if (!('fullscreenElement' in document)) {
  Object.defineProperty(document, 'fullscreenElement', {
    get: () => {
      return document.mozFullScreenElement ||
             document.msFullscreenElement ||
             document.webkitCurrentFullScreenElement ||
             document.webkitFullscreenElement;
    },
  });
  Object.defineProperty(document, 'fullscreenEnabled', {
    get: () => {
      return document.mozFullScreenEnabled ||
             document.msFullscreenEnabled ||
             document.webkitFullscreenEnabled;
    },
  });
}
```

document 에 `fullscreenElement` 가 존재하지 않는 경우, `Object.defineProperty` 를 통해 `fullscreenElement`, `fullscreenEnabled` 를 재정의했다.  
이때 접근자 서술자인 get 으로 각각의 브라우져별로 fullscreenElement, fullscreenEnabled 를 반환하도록 했다.


## proxy handler 를 이용한 각각의 브라우져별 이벤트 리스너 등록  

```javascript
// ...
  const proxy = shaka.polyfill.Fullscreen.proxyEvent_;
  document.addEventListener('webkitfullscreenchange', proxy);
  document.addEventListener('webkitfullscreenerror', proxy);
  document.addEventListener('mozfullscreenchange', proxy);
  document.addEventListener('mozfullscreenerror', proxy);
  document.addEventListener('MSFullscreenChange', proxy);
  document.addEventListener('MSFullscreenError', proxy);
}
  /**
   * Proxy fullscreen events after changing their name.
   * @param {!Event} event
   * @private
   */
  static proxyEvent_(event) {
    const eventType = event.type.replace(/^(webkit|moz|MS)/, '').toLowerCase();
    const newEvent = document.createEvent('Event');
    newEvent.initEvent(eventType, event.bubbles, event.cancelable);
    event.target.dispatchEvent(newEvent);
  }
};
```

각각의 브라우져별 fullscreen 관련 이벤트인 `fullscreenchange`, `fullscreenerror` 를 proxy handler 를 통해 등록했다.  
이때 `proxyEvent_` 를 통해 event type 에서 `webkit`, `moz`, `MS` 를 제거하고 소문자로 변경한 후, 새로운 이벤트를 생성하여 dispatch 하도록 했다.    
이렇게 되면 실제 해당 엘리먼트에는 `fullscreenchange`, `fullscreenerror` 이벤트만 달아도 모든 브라우져에서 이벤트가 울리도록 설정할 수 있다.



