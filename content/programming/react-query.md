---
title: React Query
tags:
  - React
---

## 개요

서버 상태와 클라이언트 상태를 분리한다.  
클라이언트에서 관리하는 상태는 그렇게 많지 않다.

## SSR

queryClient 에 데이터를 전달하는 방법을 사용

- initialData 를 이용하는 방법

## react-query 는 동시에 나가는 요청의 중복을 제거한다.  
각각의 컴포넌트에서 useQuery 를 사용하더라도, 동일한 요청에 관해서는 중복을 제거한다.


## useQuery 의 isFetching 과 isLoading 의 차이

- isFetching
    - 캐시된 데이터가 존재하는 상태
    - query 함수가 아직 resolve 되지 않았다.
- isLoading
    - 캐시된 데이터가 없고 + isFetching


## Stale Time 과 Cache Time 의 차이

- A 쿼리 인스턴스가 mount 됨
- 네트워크에서 데이터 fetch 하고 A라는 query key로 캐싱함
- 이 데이터는 `fresh` 상태에서 `staleTime`(기본값 0) 이후 `stale` 상태로 변경됨
- A 쿼리 인스턴스가 unmount 됨
- 캐시는 `cacheTime`(기본값 5min) 만큼 유지되다가 가비지 콜렉터로 수집됨 → 이때 캐시된 데이터도 사라짐
- 만일 `cacheTime`이 지나기 전에 A 쿼리 인스턴스가 새롭게 mount되면, fetch가 실행되고 `fresh`한 값을 가져오는 동안 캐시 데이터를 보여줌
  

### 상태별 특징

fresh 상태에서는 아무리 새롭게 마운트를 해도 fetching 이 일어나지 않음

fetching 은 데이터를 가져오는 중인 상태 → 캐시된 데이터가 있으면 그 데이터를 사용할 수 있음


**Stale Time (기본값: 0)**

데이터가 fresh 에서 stale 까지 걸리는 시간

**Cache Time (기본값: 5min)**

데이터가 inactive 상태에서 Cache Time 만큼 유지된 이후에 가비지 콜렉터로 수집된다.

## Stale Time 이 0인 이유

0으로 설정함으로써 서버에서 가져온 데이터가 항상 오래된 데이터라고 생각하는 것이 맞다.

그래야지 항상 최신 상태를 유지할 수 있기 때문이다.

## Pre Fetching

좀 더 좋은 UX 를 보여주기 위해 다음에 가져올 데이터를 미리 가져오는 방법

queryClient 의 prefetchQuery 를 이용해서 다음 데이터를 미리 가져올 수 있다.

```typescript
useEffect(()=>{
  if(currentPage >= maxPostPage) {
    return;
  }
  const nextPage = currentPage + 1;
  queryClient.prefetchQuery(["posts",nextPage],()=> fetchPosts(nextPage))
},[currentPage,queryClient])
```

## useQuery의 keepPreviousData

useQuery 의 `keepPreviousData` 옵션을 통해 쿼리키가 변경된 경우 새 데이터를 요청하는 동안 마지막으로 성공한 요청의 데이터를 사용할 수 있다.

## Mutation

네트워크 호출을 통해 서버의 값을 변경하는 것

## useInfiniteQuery

무한 스크롤 구현을 좀 더 편하게 해주는 쿼리 훅

```jsx
const {
  data: {
    pages, // 실제 페이지 데이터 배열 [0, 1, 2, 3] 각각의 배열 인덱스에 맞춰서 데이터가 들어가 있음
    pageParams // 다음 페이지 url 및 param 정보 -> getNextPageParam 의 리턴 값
  }, 
  fetchNextPage, // 다음 페이지 fetching 하는 함수
  hasNextPage, // 다음 페이지가 있는 경우 참
  isLoading, // 로딩 시 참
  isFetching, // 데이터 fetching 시 참
  isError // 에러 발생시 참
} = useInfiniteQuery(
  ["sw-people"], ({pageParam = initialUrl}) => {
    console.log(pageParam);
    return fetchUrl(pageParam)
  },
  {
    getNextPageParam: lastPage => lastPage.next || undefined
  }
)
```

## useIsFetching

react query 커스텀 훅으로 현재 queryClient 들의 isFetching 상태를 가져올 수있다.

## Default Error Handling

해당 프로젝트의 특성에 맞게 전역에서 에러를 핸들링

```jsx
new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      onError: (error: unknown) => {
        // error handling 
      },
    },
  },
});
```

이렇게 등록하고 커스텀 해야하는 곳에서만 별도의 onError 를 설정

## 데이터를 미리 채우는 메서드 및 옵션들

|  | 어떻게 사용 | 어디서 오는 데이터? | 캐시가 되는지 |
| --- | --- | --- | --- |
| prefetchQuery | queryClient 의 메서드 | server | true |
| setQueryData | queryClient 의 메서드 | client | true |
| placeholderData | useQuery 의 옵션 | client | false |
| initialData | useQuery 의 옵션 | client | true |

## PrefetchQuery 를 이용해 미리 데이터 가져오기

만약 80퍼센트의 유저가 홈페이지 방문후 강의 리스트 페이지로 간다면, 

홈페이지 컴포넌트에서 강의 리스트를 prefetch 해 놓는다.

## select 를 통해 가져온 데이터 커스텀하기

useQuery 의 select 옵션을 통해 가져온 데이터를 커스텀할 수 있다.

```jsx
{ select: showAll ? undefined : selectFn }
```

undefined 시에는 현재 캐시 데이터를 그래도 반환하고, 함수가 등록된 경우에는 해당 함수의 리턴을 반환한다.

## Re-fetching 을 하는 이유와 시점

새로운 데이터를 서버로 부터 받아오기 위해서 특정 시점에 refetching 을 한다.

시점

- 새로운 쿼리 인스턴스가 마운트 될때
- 리액트 컴포넌트가 mount 될때
- 창이 포커싱 될때
- 네트워크가 다시 연결 될때
- refetchInterval 이 expired 될때
    - polling
    

## Re-fetching 을 피하는 방법

- staleTime 늘리기
    - refetch 은 데이터가 stale 상태인 경우에만 요청하기 때문에 fresh 상태의 데이터를 오래 놔둔다.
- refresch option 들 끄기
    - 여러가지 refresh 옵션들이 존재하는데 이들을 끄면 된다.
- 정말 한번 가져오면 정말 안가져와도 되는 데이터들은 조금 관리해줘도 괜찮을 것 같음

## 전역 refetch option

queryClient에 설정가능

```jsx
new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      onError: (error: unknown) => {
        queryErrorHandler(error);
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});
```

## queryClient.setQueryData

쿼리 키 기반으로 클라이언트 캐시 데이터를 업데이트 시킨다. 

```jsx
queryClient.setQueryData(queryKey, updater)
```

## queryClient.getQueryData

쿼리 키 기반으로 클라이언트 캐시 데이터를 반환한다. 제네릭으로 리턴하는 값의 타입을 지정할 수도 있다.

## getQueryData VS useQuery  

해당 Discussions 링크를 첨부한다.  
[What is the best (or alternate) ways to fetch the server data from a child component when the parent component hits an api that returns all the data that we need?](https://github.com/tannerlinsley/react-query/discussions/1619)

데이터가 필요한 컴포넌트에서 직접 useQuery 를 요청하는 것을 권장한다.

## query 의 onSuccess 가 울리는 시점

- queryClient 의 setQueryData
- query 인스턴스 생성

이로인해 알게된 사실은 모든 API fetching 을 useQuery 로만 해결하는 것이 아니라, api의 성공 응답에 setQueryData 를 해도 괜찮다.

아래 예제 같은 경우에도 login, logout 하는 API 는 별도로 존재하고, 해당 API 의 성공 콜백에서 setQueryData 를 진행하였다.

```jsx
export function useUser(): UseUser {
  // TODO: call useQuery to update user data from server
  const queryClient = useQueryClient();
  const { data: user } = useQuery(queryKeys.user, () => getUser(user), {
    onSuccess: (received: User | null) => {
      console.log({ received });
      if (!received) {
        clearStoredUser();
      } else {
        setStoredUser(received);
      }
    },
  });

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    queryClient.setQueryData(queryKeys.user, 'hello');
  }

  // meant to be called from useAuth
  function clearUser() {
    queryClient.setQueryData(queryKeys.user, null);
  }

  return { user, updateUser, clearUser };
}
```

updateUser 를 실행시켰을 때 useQuery 의 onSuccess 콜백이 실행된다.

## query 의 initialData 를 이용해서 쿼리 인스턴스의 초기 데이터를 셋팅한다.

initialData 는 일반 값 객체가 될 수도 있고, 함수 형태로 리턴 값을 넣을 수도 있다.

[Initial Query Data](https://react-query.tanstack.com/guides/initial-query-data#using-initialdata-to-prepopulate-a-query)

```jsx
function Todo({ todoId }) {
   const result = useQuery(['todo', todoId], () => fetch('/todos'), {
     initialData: () => {
       // Use a todo from the 'todos' query as the initial data for this todo query
       return queryClient.getQueryData('todos')?.find(d => d.id === todoId)
     },
   })
 }
```

initialData 에서 기존 queryClient 의 값을 가져와서 보여주는 것도 가능하다.

## query 의 enabled 옵션을 이용해서 의존성 쿼리 인스턴스를 만든다.

[https://react-query.tanstack.com/guides/dependent-queries](https://react-query.tanstack.com/guides/dependent-queries)

```jsx
const{data: userAppointments = fallback}= useQuery(
	'user-appointments',
	()=> getUserAppointments(user),
	{
		enabled: !!user,
	},
);
```

## queryClient 의 removeQueries 는 쿼리 인스턴스를 제거한다.

devtool 로 확인한 결과 쿼리 클라이언트 자체를 제거한다.

setQueryData null 과 removeQueries 와 동작이 비슷하지만, setQueryData 는 쿼리의 onSuccess 함수를 호출한다는 것에 의미가 있다.

## mutation 전역 에러 헨들링
query 와 비슷하게 QueryClient 인스턴스를 생성하는 과정에서 전역 에러 핸들링을 추가할 수 있다.

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    ...,
    mutations: {
      onError: queryErrorHandler
    }
  }
})
```

## 전역 mutation loading 은 `useIsMutating` 을 사용한다.

```jsx
export function Loading(): ReactElement {
	const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const display = isFetching || isMutating ? 'inherit' : 'none';
  
  return <Loading {display} />
}

```


## useMutation 과 useQuery 의 차이점

- 캐시 데이터가 없음 (no cache data)
- 재시도가 없음 (no retries)
- 재패치가 없음 (no refetch)
- isFetching 이 없음 (캐시 데이터가 없기 때문에, 모든 로딩은 isLoading 으로 판별)
- mutate 함수를 리턴하고 mutate 함수가 실행될 때 동작한다.
- onMutate callback 존재

## UseMutateFunction의 제네릭

```jsx
UseMutateFunction<TData, TError, TVariables, TContext>

TData: mutate 의 리턴 타입
TError: mutate 의 에러 타입
TVariables: mutate 함수의 인자 타입
TContext: onMutate 콜백의 인자 타입
```

## UseMutateFunction 사용 예시
```typescript
function useReserveAppointment(): UseMutateFunction<void, Error, Appointment, unknown> {
  const { mutate } = useMutation((appointment: Appointment) => setAppointmentUser())

  return mutate;
}
```

## queryClient.invalidateQueries
쿼리를 무효화 시켜 새로운 쿼리 데이터를 fetching 한다.

invalidateQueries 의 효과  
- query 를 stale 상태로 만든다.
- 만약 현재 렌더링 중이라면 re-fetch 한다.

## Query Key Prefixes
useQuery 의 쿼리키의 기준 잘 설정해서, invalidateQueries 를 할떄 그룹핑하는 방법이 있다.

예를 들어, 해당 mutate 성공 시 user 관련 쿼리들을 일괄 invalidateQueries 를 해야된다고 할때 유용하다.

## onSuccess 로직에서 return 을 하면 await 처럼 동작한다.

onSuccess 로직에서 return 을 사용하게 되면 await 를 건것처럼 동작하게 된다.
```jsx
{
  {
    onSuccess: () => {
      return queryClient.refetchQueries('todos'); // 해당 refetch 가 성공했을 때 이후 로직이 수행된다.
    }
  }

  {
    onSuccess: () => {
      queryClient.refetchQueries('todos'); // void 처럼 동작함
    }
  }
}
```


## infiniteQuery 에서는 invalidateQueries 가 동작하지 않는 것 같다.
mutate 이후에 onSuccess 로직에서 infiniteQuery 를 invalidate 해야하는 일이 있었다.
(상세페이지에서 좋아요를 누르고, 다시 리스트 페이지로 이동한 경우)

하지만 infiniteQuery 가 invalidate 상태로 변하지 않았다.

https://github.com/tannerlinsley/react-query/discussions/1264

쓰레드로 확인했을 때 제작자분은 되는게 정상이라고 하시는데, 나는 잘 되지 않았다.

그래서 임시방편으로 refetchQueries 를 사용했다.


## mutate 와 useMutation 에 onSuccess 로직
mutation 이 성공했을때의 로직을 담을 수 있는 함수인 onSuccess 는 useMutation 의 세 번쨰 인자 or onSuccess 의 두 번째 인자로 넘길 수 있다. 

```js
 const {
   mutate,
 } = useMutation(mutationFn, {
   onSuccess,
 })
 
 mutate(variables, {
   onSuccess: () => {

   },
 })
```

## useMutation 의 동작
**onMutate**
mutation 이 시작하였을 때
mutation 에서 return 하는 값은 해당 mutation 에서 context 로 참조가 가능하다.

**onError**
에러가 발생했을 때

**onSuccess**
성공했을 때

**onSettled**
mutation 이 끝났을 때, 성공 or 실패 에 상관없이 실행됨

```jsx
useMutation(addTodo, {
  onMutate: variables => {
    return { id: 1 };
  },
  onError: (error, variables, context) => {
    console.log(`에러 발생: ${context.id}`);
  },
  onSuccess: (data, variables, context) => {
    console.log('성공');
  },
  onSettled: (data, error, variables, context) => {
    console.log('mutation 끝남');
  },
});
```

## onSuccess 의 인자
**data**
API 응답 값

**variables**
mutate 함수 실행 인자

**context**
onMutate 함수에서 return 한 값


```jsx
onSuccess: (data, variables, context) => {
  console.log('성공');
}
```
## useQuery 사용시 isLoading 과 data 유무를 전부 확인해야한다.
간혹 useQuery 를 사용할 때 단순히 isLoading 으로만 데이터 유무를 판단할 때가 있었다.

```jsx


const { data, isLoading } = useQuery();

if (isLoading) { // fetching 끝난후
  return <div>Loading 중...</div>
}

return (
  <div>{data?.hello}</div>
)
```

이렇게 되는 경우 API 가 실패한 경우 해당 컴포넌트 에러가 발생한다.
데이터를 fetching 하는 동안 isLoading 이 true 가 된다.

이후 API 가 실패해서 데이터가 정상적으로 불러와지지 않은 상태에서 isLoading 은 false 가 되고, data는 undefined 가 된다.

`data.hello` 에서 에러가 발생한다.

따라서 isError 혹은 data 의 유무와 같은 적당한 분기가 필요하다.

## Optimistic Updates
직역하면 낙관적 업데이트로, 사용자의 요청이 오면 즉시 해당 UI 를 업데이트 시키고, 이후 서버의 응답으로 업데이트 혹은 UI 롤백을 시키는 방법이다.  
좋아요를 눌렀을 때 사용하기 좋다.

```jsx
useMutation(updateTodo, {
  // mutate 실행
  onMutate: async newTodo => {
    // cancelQueries 를 통해 혹시 실행되고 있는 refetch 를 취소한다.
    await queryClient.cancelQueries(['todos', newTodo.id])

    // 기존 데이터 가져오기
    const previousTodo = queryClient.getQueryData(['todos', newTodo.id])

    // 낙관적 업데이트
    queryClient.setQueryData(['todos', newTodo.id], newTodo)

    // 해당 mutation 에서 사용할 context 리턴
    return { previousTodo, newTodo }
  },
  // 에러 발생 시 기존에 업데이트 했던 데이터 되돌리기
  // 이때 onMutate 에서 리턴한 값을 세번째 인자인 context 에서 사용할 수 있음
  onError: (err, newTodo, context) => {
    queryClient.setQueryData(
      ['todos', context.newTodo.id],
      context.previousTodo
    )
  },
  // 성공 or 실패 이후에 쿼리 리패치
  onSettled: newTodo => {
    queryClient.invalidateQueries(['todos', newTodo.id])
  },
})
```

## setLogger
react query 에서 발생하는 로그를 setLogger 함수를 통해 커스텀할 수 있다.  
사내에서는 윈스턴을 사용하니 전역적으로 설정하면 도움이 될 것 같다. 

```jsx
import { setLogger } from 'react-query'
import { printLog, printWarn, printError } from 'custom-logger'

// Custom logger
setLogger({
  log: printLog,
  warn: printWarn,
  error: printError,
})

// Winston logger
setLogger(winston.createLogger())
```

## Query Test 는 msw와 react-testing-library 를 사용한다.
jest 환경에서 msw 를 셋팅하여 테스트하면 실제 API 통신을 목킹할 수 있다.

msw 는 튜토리얼이 잘되어 있어 설치 및 작성 방법은 아래 공식문서를 참고한다.
https://mswjs.io/

msw 에서 지정한 헨들러를 통해 테스트 코드에서 네트워크 통신을 목킹한다.

**req**  
요청, 요청에 관련된 정보가 담겨있는 object

**res**  
응답, mocked response 생성을 도와주는 함수

**ctx**  
status code 나 headers, body, 등등을 셋팅할 수 있는 인스턴스

```js
const worker = setupWorker(
  rest.post('/login', (req, res, ctx) => {  ctx   
    const { username } = req.body
    return res(
      ctx.json({
        username,
        firstName: 'John'
      })
    )
  }),
)
```

## Test 시 Query Wrapper 를 사용한다.


## mutate 테스트 하는 방법
