---
title: Suspense 설명회
tags:
  - react
  - 설명회
---

**서론**

단순히 로딩을 보여주는 컴포넌트가 아니다

### Suspense 그 이전

useState 로 loading 상태를 관리

if 문을 통한 로딩 방식

```jsx
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetch(`https://api.example.com/users/${userId}`)
     .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        return response.json();
      })
     .then(data => {
        setUser(data);
      })
     .catch(err => {
        setError(err);
      })
     .finally(() => {
        setIsLoading(false);
      });
  }, [userId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

해당 방식의 단점

- 로딩, 에러, 성공 상태를 처리하는 로직이 컴포넌트 내부

```jsx
import React, { Suspense, lazy } from 'react';

// 이 컴포넌트는 MyComponent가 렌더링될 때 동적으로 로드됩니다.
const OtherComponent = lazy(() => import('./OtherComponent'));

// MyComponent는 Suspense를 사용하여 비동기 로딩을 처리합니다.
function MyComponent() {
  return (
    <div>
      <h1>My Component</h1>
      <p>아래 내용은 로딩이 완료된 후 표시됩니다.</p>
      <Suspense fallback={<div>로딩 중...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}

export default MyComponent;
```

Suspense 는

- 선언적으로 로딩을 다룰 수 있도록 해줌
- 관심사 분리 용이
    - 컴포넌트 안에서는 성공상태의 데이터 렌더링만
    - 로딩은 Suspense
    - 에러는 Errorboundry
- 렌더링을 막는 것이 아니라 렌더링을 즉시하게 됨

Fetch-on-Render 와 Render-as-You-Fetch

- [https://blog.logrocket.com/react-suspense-data-fetching/#:~:text=smoother user experience.-,React data fetching patterns,-Whenever a React](https://blog.logrocket.com/react-suspense-data-fetching/#:~:text=smoother%20user%20experience.-,React%20data%20fetching%20patterns,-Whenever%20a%20React)

### Suspense 의 기본 컨셉

**Suspense 는 Promise 를 throw 하고, Suspense 컴포넌트가 던져진 Promise 가 resolve 되기 전까지 fallback 을 보여주다가, resolve 되면 다시 렌더링을 시도한다.**



### 각각의 라이브러리들의 suspense 구현 방식

react lazy 의 suspense

https://github.com/facebook/react/blob/main/packages/react/src/ReactLazy.js#L124

```jsx
function lazyInitializer<T>(payload: Payload<T>): T {
  if (payload._status === Uninitialized) {
    const ctor = payload._result;
    const thenable = ctor();
    thenable.then(
      moduleObject => {
        if (
          (payload: Payload<T>)._status === Pending ||
          payload._status === Uninitialized
        ) {
          // Transition to the next state.
          const resolved: ResolvedPayload<T> = (payload: any);
          resolved._status = Resolved;
          resolved._result = moduleObject;
        }
      },
      error => {
        if (
          (payload: Payload<T>)._status === Pending ||
          payload._status === Uninitialized
        ) {
          // Transition to the next state.
          const rejected: RejectedPayload = (payload: any);
          rejected._status = Rejected;
          rejected._result = error;
        }
      },
    );
    if (payload._status === Uninitialized) {
      // In case, we're still uninitialized, then we're waiting for the thenable
      // to resolve. Set it as pending in the meantime.
      const pending: PendingPayload = (payload: any);
      pending._status = Pending;
      pending._result = thenable;
    }
  }
  if (payload._status === Resolved) {
    const moduleObject = payload._result;
		// 개발 환경 관련 코드 주석...
    return moduleObject.default;
  } else {
    **throw payload._result;**
  }
}
```

- 초기 상태 (Uninitialized):
    - _result에 로더 함수 저장
    - 컴포넌트 렌더링 시 로딩 시작
- 로딩 중 (Pending):
    - _result에 Promise 저장
    - Promise를 throw하여 Suspense 경계에서 fallback UI 표시
- 로딩 완료 (Resolved):
    - _result에 로드된 모듈 저장
    - moduleObject.default를 반환하여 실제 컴포넌트 렌더링
- 로딩 실패 (Rejected):
    - _result에 에러 저장
    - 에러를 throw하여 Error Boundary에서 처리

react-query 의 suspense

- https://github.com/TanStack/query/blob/main/packages/react-query/src/suspense.ts#L48-L53

```jsx
export const shouldSuspend = (
  defaultedOptions:
    | DefaultedQueryObserverOptions<any, any, any, any, any>
    | undefined,
  result: QueryObserverResult<any, any>,
) => defaultedOptions?.suspense && result.isPending
```

- https://github.com/TanStack/query/blob/main/packages/react-query/src/useBaseQuery.ts#L120-L122

```jsx
export function useBaseQuery<
  TQueryFnData,
  TError,
  TData,
  TQueryData,
  TQueryKey extends QueryKey,
>(
  options: UseBaseQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >,
  Observer: typeof QueryObserver,
  queryClient?: QueryClient,
): QueryObserverResult<TData, TError> {
 // 중략...
 
 // Handle suspense
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
  }

}
```

- suspense 로 인해 fallback 컴포넌트가 마운트되고, 이후 데이터가 다 불러와진 이후에 다시 원래 컴포넌트를 리마운트 하는 과정에서 staleTime 으로 인해 refetch 가 발생할 수 있음
    - suspense option 활성화 시 staleTime 과 gcTime 이 1000ms 로 자동 설정됨
    - https://github.com/TanStack/query/discussions/5162
    - https://github.com/TanStack/query/blob/main/packages/react-query/src/suspense.ts#L21-L41

```jsx
export const ensureSuspenseTimers = (
  defaultedOptions: DefaultedQueryObserverOptions<any, any, any, any, any>,
) => {
  if (defaultedOptions.suspense) {
    // Handle staleTime to ensure minimum 1000ms in Suspense mode
    // This prevents unnecessary refetching when components remount after suspending

    const clamp = (value: number | 'static' | undefined) =>
      value === 'static' ? value : Math.max(value ?? 1000, 1000)

    const originalStaleTime = defaultedOptions.staleTime
    defaultedOptions.staleTime =
      typeof originalStaleTime === 'function'
        ? (...args) => clamp(originalStaleTime(...args))
        : clamp(originalStaleTime)

    if (typeof defaultedOptions.gcTime === 'number') {
      defaultedOptions.gcTime = Math.max(defaultedOptions.gcTime, 1000)
    }
  }
}
```

nextjs dynamic imports 의 suspense

```jsx
// 코드 분석 중
```

### MySuspense 구현

suspense 를 직접 구현해서 컨셉을 이해

Promise 를 던지는 wrapper 함수

```jsx
function createResource(asyncFn) {
  // 1. 비동기 작업의 상태를 추적
  let status = 'pending';
  let result;
  let suspender;

  // 2. 비동기 함수를 즉시 호출하여 Promise 를 얻음
  suspender = asyncFn().then(
    (r) => {
      // 3. 성공 시 상태와 결과를 저장
      status = 'success';
      result = r;
    },
    (e) => {
      // 4. 실패 시 상태와 에러를 저장
      status = 'error';
      result = e;
    }
  );

  // 5. read 메서드를 가진 객체를 반환합니다.
  return {
    read() {
      if (status === 'pending') {
        // 6. 아직 로딩 중이면, Promise 던지기
        throw suspender;
      } else if (status === 'error') {
        // 7. 에러가 발생했다면, 에러를 던지기
        throw result;
      } else if (status === 'success') {
        // 8. 성공했다면, 결과를 반환
        return result;
      }
    },
  };
}
```

MySuspense

- componentDidCatch 에서 Promise catch
- 내부 isSuspended 상태 변경
- render 함수에서 isSuspended 상태에 따라 fallback or children

```jsx
import React from 'react';

class MySuspense extends React.Component {
  state = {
    isSuspended: false,
  };

  componentDidCatch(error) {
    // 1. 포착된 'error'가 Promise인지 확인

    if (typeof error.then === 'function') {
      // 2. Promise라면 (thenable), isSuspended 상태를 true로 설정
      this.setState({ isSuspended: true });

      // 3. Promise가 완료되면, isSuspended 상태를 false 로 설정
      error.then(() => {
        this.setState({ isSuspended: false });
      });
    } else {
      // 4. 실제 에러라면, 다시 던져서 상위의 Error Boundary가 처리
      throw error;
    }
  }

  render() {
    const { fallback, children } = this.props;
    const { isSuspended } = this.state;

    // isSuspended 상태에 따라 fallback 또는 실제 자식 컴포넌트를 렌더링
    return isSuspended? fallback : children;
  }
}

export default MySuspense;
```

사용처

```jsx
import { createResource } from './createResource';

function fetchUserProfile(userId) {
  console.log(`[API] Fetching user ${userId}...`);
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`[API] Fetched user ${userId}.`);
      resolve({
        name: `User ${userId}`,
        bio: `This is the bio for user ${userId}.`,
      });
    }, 2000); // 2초 지연 시뮬레이션
  });
}

export function createUserResource(userId) {
  return createResource(() => fetchUserProfile(userId));
}
```

```jsx
import React from 'react';
import MySuspense from './MySuspense';
import { createUserResource } from './api';

const resource = createUserResource(1);

function UserProfile() {
  const user = resource.read();
  console.log(' UserProfile rendered successfully.');
  return <h1>{user.name}</h1>;
}

function App() {
  console.log(' App rendering...');
  return (
    <div>
      <h2>My Awesome App</h2>
      <MySuspense fallback={<h2>Loading user profile...</h2>}>
        <UserProfile />
      </MySuspense>
    </div>
  );
}

export default App;
```

### 기존 Suspense 와 MySuspense 의 차이점

- Concurrency
    - ?
-

참고 문헌

https://saengmotmi.netlify.app/react/react-lazy/

https://blog.logrocket.com/react-suspense-data-fetching/#:~:text=smoother%20user%20experience.-,React%20data%20fetching%20patterns,-Whenever%20a%20React

---

https://blog.sjoleee.info/posts/suspense-1

https://jser.dev/react/2022/04/02/suspense-in-concurrent-mode-1-reconciling

https://jser.dev/react/2022/04/17/offscreen-component

https://ko.react.dev/reference/react/Suspense

https://github.com/reactwg/react-18/discussions/37

[https://velog.io/@woogur29/Suspense가-Hydration중에-동작하는-방식](https://velog.io/@woogur29/Suspense%EA%B0%80-Hydration%EC%A4%91%EC%97%90-%EB%8F%99%EC%9E%91%ED%95%98%EB%8A%94-%EB%B0%A9%EC%8B%9D)

https://maxkim-j.github.io/posts/suspense-argibraic-effect/
