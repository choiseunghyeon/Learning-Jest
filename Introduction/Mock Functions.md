# Mock Functions

Mock functions allow you to test the links between code by erasing the actual implementation of a function, capturing calls to the function (and the parameters passed in those calls), capturing instances of constructor functions when instantiated with new, and allowing test-time configuration of return values.

모의 함수을 사용하는 두 가지 방법이 있습니다.
test code에서 사용할 모의 함수를 생성하거나 또는 모듈 종속성을 재정의하기 위해 manual mock을 작성하는 것

## Using a mock function - 모의 함수 사용

forEach function의 구현을 테스팅 한다고 상상해보자.
이 함수는 제공된 배열의 각 항목에 대해 callback을 호출한다.

```javascript
function forEach(items, callback) {
  for (let index = 0; index < items.length; index++) {
    callback(items[index]);
  }
}
```

이 함수를 테스트하기 위해서 모의 함수를 사용하고 모의 상태를 검사하여 콜백이 예상대로 호출 되는지 학인할 수 있습니다.

```javascript
const mockCallback = jest.fn(x => 42 + x);
forEach([0, 1], mockCallback);

// the mock function is called twice
expect(mockCallback.mock.calls.length).toBe(2);

// the first argument of the first call to the function was 0
expect(mockCallback.mock.calls[0][0]).toBe(0);

// the first argument of the second call to the function was 1
expect(mockCallback.mock.calls[1][0]).toBe(1);

// the return value of the first call to the function was 42
expect(mockCallback.mock.results[0].value).toBe(42);
```
