---
title: 프론트엔드 테스트
tags:
  - Test
---

## 기능의 테스트는 실제 해당 기능을 구현한 곳에서 한다.

컴포넌트를 테스트할 때 실제 해당 기능을 구현한 곳에서 **기능에 대한 테스트**를 진행하고, 나머지 영역에서는 **호출만 테스트**한다.

```jsx
# App.js
const App = () => {
	const [title, setTitle] = useState('');
	
	const handleChange = (event) => {
		setTitle(event.target.value);
	};
	return <Input value={title} onChange={handleChange} />
}

# App.test.js

test('input 에 입력 시, 입력값이 input 에 노출된다.', () => {
  const { container, getByRole } = render(<App />);
  const input = getByRole('textbox', { name: /할 일/i });

  fireEvent.change(input, { target: { value: 'Study' } });
  expect(input).toHaveValue('Study');
});
```

```jsx
# Input.js
const Input = ({ value, onChange }) => {
	return (<>
		<label htmlFor="input-task-title">
      할 일
    </label>
		<input 
			id="input-task-title"
			type="text"
			value={value}
      onChange={onChange}
		/>
	</>)
}

# Input.test.js

test('입력 시, onChange 함수가 호출된다.', () => {
	const handleChange = jest.fn();
	const { container, getByRole } = render((
    <Input
      value={value}
      onChange={handleChange}
    />
  ));
  const input = getByRole('textbox', { name: /할 일/i });

  fireEvent.change(input, { target: { value: 'hello' } });
  expect(handleChange).toBeCalled();
});
```

## renderComponent 함수 등을 사용해서 반복을 줄인다.

테스트 코드는 말 그대로 어떤 함수의 설명서같은 역할을 한다. 따라서 과도한 고도화는 지양한다. 

하지만 테스트 코드를 작성하다보면 컴포넌트 렌더링과, 해당 테스트에서 자주 사용하는 요소를 따로 빼는 것이 이해하는데 도움이 된다고 판단했다.

1. 렌더링 대상
2. 자주 사용하는 돔 요소
3. 자주 사용하는 selector 함수

```jsx
const renderApp = () => {
  const { container, getByRole } = render(<App />);
  const input = getByRole('textbox', { name: /할 일/i });

  return { container, input, getByRole };
};
```

## describe ~ context ~ it 을 통해 테스트 시나리오를 작성한다.

**describe** 는 테스트의 주체

**context** 는 따로 비교를 해줘야할 맥락(상황)이 있을 때 선택적으로 사용

**it** 은 실제 테스트하는 내용을 서술한다.

## 테스트 하나하나는 독립적으로 실행된다.

컴포넌트를 테스트하다보면, 앞서 테스트한 선행동작을 사용해야하는 경우가 있는 데, 이때 동기적으로 테스트를 작성하면 안되고, 각각의 테스트는 독립적으로 실행된다고 생각하여 작성해야한다.

그리고 그런 상황에서 해당 테스트 2개가 묶일 수 있는지도 고려해본다.

각각의 테스트를 독립적으로 사용하기 위해 테스트의 시작, 끝 지점에 실행시켜주는 hook을 설정할 수 있다.

```jsx
beforeEach(() => {
  jest.clearAllMocks();
});
```

## 테스트 명은 비즈니스 명세를 사용한다.

테스트를 작성하다보면, 구현을 테스트으로 작성하는 경우가 있다.

단위테스트를 작성하다보면 자연스러운 일이지만, 지나치게 구현에 대한 설명으로 작성하면 테스트가 깨지기 쉽다.

```jsx
// Bad
it('등록 버튼 클릭 시, todoList 배열에 row 1개가 추가된다.', () => {...})

// Good
it('등록 버튼 클릭 시, 새로운 할일이 추가된다.', () => {...})
```

## console.log 대신 IDE 의 debugger 사용을 지향한다.

프론트엔드 개발을 진행하다보면 중간중간 값의 결과를 console.log 로 확인하는 경우가 있다.

물론 해당 방법도 디버깅에 많은 도움을 주지만 IDE 의 디버깅 기능을 사용하면 해당 시점의 변수의 값등 여러 기능을 사용할 수 있다.

## 가장 빠르게 문제를 해결할 수 있는 방법으로 변경 후 리펙토링한다.

테스트 코드 작성을 하다보면 오히려 기능을 크게 생각하는 경우가 있다.

Todo list 를 개발한다고 하면, 이미 머리속으로는 할 일을 중앙상태로 관리하고, 관심사를 어떻게 분리하고... 등등 개발에 포커싱을 맞추어 생각하기 마련이다. 이런 생각은 후에 개발이 완료된 이후 테스트 작성을 막막하게 한다.

더 좋은 구조로 코드를 작성하기 위해서는 내가 현재 구현하고자 하는 기능이 명확하게 무엇인지 아는 것이 중요하다.

이때 테스트를 작성한다. 내가 구현하고자 하는 내용을 테스트로 작성하고, 해당 테스트를 가장 빠르게 통과시킬 수 있는 구현에 집중한다. 그 후에 리펙토링한다.

```jsx
test('할 일 리스트가 노출된다.', () => {
  const { container } = render(<App />);
	
	expect(container).toHaveTextContent('블로그 글쓰기');
	expect(container).toHaveTextContent('재미있게 놀기');
});
```

위 테스트를 가장 빠르게 해결할 수 있는 방법은 아래 코드이다.

```jsx
const App = () => {
	return (<>
		<span>블로그 글쓰기</span>
		<span>재미있게 놀기</span>
	</>);
}
```

위 코드를 작성한 후에 해당 할 일 리스트들을 어떤 방식으로 관리할 지를 고민해서 테스트를 작성하고, 리펙토링한다.

## submit event 를 mocking 할때는 mockImplementaion 을 통해서 preventDefault 메서드를 실행시켜준다.

submit 이벤트를 테스트 해야하는 경우에 해당 오류가 발생한다.

```jsx
Error: Not implemented: HTMLFormElement.prototype.submit
```

아래 방법으로 해결할 수 있다.

```jsx
// jest.fn 으로 mocking
const handleSubmit = jest.fn((event) => {
	event.preventDefault();
});

// mockImplementation 으로 mocking
handleSubmit.mockImplementation((event) => {
	event.preventDefault();
});
```

## Container Components 에서는 해당 action이 dispatch 가 잘 되었는지 테스트한다.

리덕스를 사용하는 경우 Container 컴포넌트에서는 mocking한 dispatch가 정확한 액션으로 호출되었는지만 테스트한다. 실제 state 의 변화는 reducer 테스트로 검증하고, 실제 앱에서 해당 데이터가 정확이 노출되는 지는 Presentation Component 에서 테스트한다.

## jest 에서 mock들을 정리하는 방법**

```jsx
// 각각의 mock 함수에서 mockClear 메서드 실행
mockFn.mockClear();

// jest 에서 제공하는 clearAllMock 실행
jest.clearAllMocks();
```

참고자료: [https://haeguri.github.io/2020/12/21/clean-up-jest-mock/](https://haeguri.github.io/2020/12/21/clean-up-jest-mock/)

## jest.unmock 으로 mock 모듈 해제하기

jest 에서는 특정 모듈을 mocking 하기 위해서 `__mocks__` 라는 폴더에 mock 들을 구현하고, 이때 jest 설정중에 automock 이 true 로 되어있는 경우는 해당 폴더에 있는 라이브러리 들을 자동으로 mocking 해준다.