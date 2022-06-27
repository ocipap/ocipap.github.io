---
title: Typescript
tags:
  - Typescript
---

## ReturnType 으로 타입 좁히기

### 현상

```tsx
const test = {
  aaaa: {
    getValue: () => 'hello',
  },
  bbbb: {
    getValue: () => 123,
  },
};

const foo = (testKey: keyof typeof test) => {
  const a = test[testKey].getValue(); // a type is number | string

  return a;
};

const b = foo('aaaa'); // b type is number | string   --> hope, string
const c = foo('bbbb'); // c type is number | string   --> hope, number
```

b 의 타입은 `string`, c 의 타입은 `number` 로 추론하는 것을 기대했지만, 객체 프로퍼티에서 동일한 이름을 가진 함수의 리턴 타입이 다를 때 해당 함수의 key 값을 명시해줘도 타입을 추론하지 못하는 현상이다.

### 원인

타입 스크립트에서 `testKey` 로 접근한 `getValue` 함수의 리턴 타입을 추론할 수 없기 때문인데 `ReturnType` 을 이용해 해결하였다.

### 해결

```tsx
const test = {
  aaaa: {
    getValue: () => 'hello',
  },
  bbbb: {
    getValue: () => 123,
  },
  cccc: {
    getValue: () => true,
  },
  dddd: {
    getValue: () => [] as number[],
  },
};

const foo = <T extends keyof typeof test>(testKey: T): ReturnType<typeof test[T]['getValue']> => {
  return test[testKey].getValue() as any;
};

const a = foo('aaaa'); // string
const b = foo('bbbb'); // number
const c = foo('cccc'); // boolean
const d = foo('dddd'); // number[]
```




