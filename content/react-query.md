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

stale 에서 inactive 로 넘어가는 건 어떻게 테스트해야할지 모르겠음... 쿼리 인스턴스가 unmount 가 되면 된다는데...

Stale Time (기본값: 0)

데이터가 fresh 에서 stale 까지 걸리는 시간

Cache Time (기본값: 5min)

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

## 도메인 별로 쿼리를 둔다

```jsx
function useUser() {
  // query 문

  // set 문

  // clear 문
}
```

데이터가 필요한 영역에서 바로 useQuery 를 때리고, 해당 쿼리의 fresh 상태를 오래 가져가면

해당 쿼리 인스턴스에 대한 refetch 없이 오래동안 데이터를 옵저빙할 수 있다.

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

