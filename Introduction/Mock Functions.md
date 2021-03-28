# Mock Functions

모의 함수를 사용하면 함수의 실제 구현을 지우고. 함수에 대한 호출(해당 호출에 전달 되는 매개변수)을 캡처하고, new로 인스턴스화 될 때 생성자 함수의 인스턴스를 캡처하고, 테스트 시간 구성을 허용하여 코드 간의 링크를 테스트할 수 있습니다.

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

## .mock property

모든 모의 함수는 특별한 .mock 속성을 가지고 있습니다.  
이 속성은 함수가 호출된 방법 및 반환 값에 대한 데이터가 보관됩니다.  
또한 .mock 속성은 각 호출에 대해 this 값을 추적합니다.  
따라서 다음과 같이 검사할 수 있습니다.

```javascript
const myMock = jest.fn();

const a = new myMock();
const b = {};
const bound = myMock.bind(b);
bound();

console.log(myMock.mock.instances);
// [ <a>, <b> ]
```

이런 mock 멤버들은 함수가 어떻게 호출되었는지, 인스턴스화 되었는지, 무엇을 반환하는지 assert 테스트 하기 유용합니다.

```javascript
// the function was called exactly once
expect(someMockFunction.mock.calls.length).toBe(1);

// the first arg of the first call to the function was 'first arg'
expect(someMockFunction.mock.calls[0][0]).toBe("first arg");

// the second arg of the first call to the function was 'second arg'
expect(someMockFunction.mock.calls[0][1]).toBe("second arg");

// the return value of the first call to the function was 'return value'
expect(someMockFunction.mock.results[0].value).toBe("return value");

// this function was instantiated exactly twice
expect(someMockFunction.mock.instances.length).toBe(2);

// the object returned by the first instantiation of this function
// had a `name` property whose value was set to 'test'
expect(someMockFunction.mock.mock.instances[0].name).toEqual("test");
```

## Mock Return Values

모의 함수를 사용하여 테스트 중에 테스트 값을 코드에 삽입할 수 있습니다.

```javascript
const myMock = jest.fn();
console.log(myMock());

myMock.mockReturnValueOnce(10).mockReturnValueOnce("x").mockReturnValueOnce(true);

console.log(myMock(), myMock(), myMock(), myMock());
// 10, 'x', true, true
```

Mock functions are also very effective in code that uses a functional continuation-passing style.
이런 스타일의 코드는 사용하기 직전에 값을 테스트에 직접 주입하는 대신에, 실제 구성 요소의 동작을 재현하는 복잡한 스텁의 필요성을 피하는데 도움이 됩니다.

```javascript
const filterTestFn = jest.fn();

// Make the mock return `true` for the first call,
// and `false` for the second call
filterTestFn.mockReturnValueOnce(true).mockReturnValueOnce(false);

const result = [11, 12].filter(num => filterTestFn(num));

console.log(result);
// 11

console.log(filterTestFn.mock.calls);
// [ [11], [12] ]
```

Most real-world examples actually involve getting ahold of a mock function on a dependent component and configuring that, but the technique is the same. In these cases, try to avoid the temptation to implement logic inside of any function that's not directly being tested.

## Mocking Modules

API에서 users 정보를 가져오는 class가 있다고 가정하자.
class는 axios를 사용하여 API를 호출한 다음 users를 가지고 있는 data 속성을 반환한다.

```javascript
// users.js
import axios from "axios";

class Users {
  static all() {
    return axios.get("/users.json").then(resp => resp.data);
  }
}

export default Users;
```

실제로 API를 쏘지 않고(느리고 취약한 테스트를 생성하지 않고) 이 메서드를 테스트 하기 위해 jest.mock()함수를 사용하여 axios 모듈을 모의할 수 있습니다.

모듈을 한번 모의하면 테스트에서 assert 하기 위한 data를 반환하는 .get에 대한 mockResolvedValue를 제공할 수 있다.  
실제로 axios.get('/users.json')이 가짜 응답을 반환하도록 합니다.

```javascript
// users.test.js
import axios from "axios";
import Users from "./users";

jest.mock("axios");

test("should fetch users", () => {
  const users = [{ name: "Bob" }];
  const resp = { data: users };
  axios.get.mockResolvedValue(resp);

  // or you could use the following depending on your use case:
  // axios.get.mockImplementation(() => Promise.resolve(resp))

  return Users.all().then(data => expect(data).toEqual(users));
});
```

## Mock Implementations

Still, there are cases where it's useful to go beyond the ability to specify return values and full-on replace the implementation of a mock function.  
모의 함수들에서 jest.fn 또는 mockImplementationOnce를 사용할 수 있습니다.

```javascript
const myMockFn = jest.fn(cb => cb(null, true));

myMockFn((err, val) => console.log(val));
// true
```

mockImplementation은 다른 모듈에서 생성된 모의 함수의 기본 구현을 정의해야 할 때 유용하다.

```javascript
// foo.js
module.exports = function () {
  // some implementation;
};

// test.js
jest.mock("../foo"); // this happens automatically with automocking
const foo = require("../foo");

// foo is a mock function
foo.mockImplementation(() => 42);
foo();
// 42
```

여러 함수 호출이 다른 결과들을 생성하는 모의 함수의 복잡한 동작을 다시 만들어야 한다면 mockImplementationOnce 사용하라.

```javascript
const myMockFn = jest
  .fn()
  .mockImplementationOnce(cb => cb(null, true))
  .mockImplementationOnce(cb => cb(null, false));

myMockFn((err, val) => console.log(val));
// true

myMockFn((err, val) => console.log(val));
// false
```

모의 함수가 mockImplementationOnce로 구현한 동작이 끝났다면 다음에는 jest.fn에서 설정한 기본 동작이 실행됩니다.(만약 설정했다면)

```javascript
const myMockFn = jest
  .fn(() => "default")
  .mockImplementationOnce(() => "first call")
  .mockImplementationOnce(() => "second call");

console.log(myMockFn(), myMockFn(), myMockFn(), myMockFn());
// 'first call', 'second call', 'default', 'default'
```

chaining을 사용하는 경우(return 값은 this) .mockReturnThis() 함수로 이를 단순화 할 수 있다.

```javascript
const myObj = {
  myMethod: jest.fn().mockReturnThis(),
};

// is the same as

const otherObj = {
  myMethod: jest.fn(function () {
    return this;
  }),
};
```

## Mock Names

선택적으로 모의 함수의 이름을 지어줄 수 있습니다.
이 이름은 테스트 오류 출력에서 "jest.fn()" 대신에 보여줍니다.
오류 내용에서 빠르게 모의 함수를 식별하고 싶을 때 사용하세요

```javascript
const myMockFn = jest
  .fn()
  .mockReturnValue("default")
  .mockImplementation(scalar => 42 + scalar)
  .mockName("add42");
```

## Custom Matchers

마지막으로!!, 모의 함수가 어떻게 호출되었는지 간단하게 assert하기 위해 몇가지 custom matcher를 만들었다.

```javascript
// the mock function was called at least once
expect(mockFunc).toHaveBeenCalled();

// the mock function was called at least once with the specified args
expect(mockFunc).toHaveBeenCalledWith(arg1, arg2);

// the last call to the mock function was called with the specified args
expect(mockFunc).toHaveBeenLastCalledWith(arg1, arg2);

// All calls and the name of the mock is written as a snapshot
expect(mockFunc).toMatchSnapshot();
```

이러한 matcher들은 .mock 속성을 검사하는 몇 가지 형식을 간단하게 만들어준다.  
간단하게 쓰거나, 구체적으로 쓰고 싶을 때는 상황에 맞게 알아서 사용하면 된다.

```javascript
// the mock function was called at least once
expect(mockFunc.mock.calls.length).toBeGreaterThan(0);

// the mock function was called at least once with the specified args
expect(mockFunc.mock.calls).toContainEqual([arg1, arg2]);

// the last call to the mock function was called with the specified args
expect(mockFunc.mock.calls[mockFunc.mock.calls.length - 1]).toEqual([arg1, arg2]);

// the first arg of the last call to the mock function was `42`
// (note that there is no sugar helper for this specific of an assertion)
expect(mockFunc.mock.calls[mockFunc.mock.calls.length - 1][0]).toBe(42);

// a snapshot will check that a mock was invoked the same number of times,
// in the same order, with the same arguments, It will also assert on the name.
expect(mockFunc.mock.calls).toEqual([[arg1, arg2]]);
expect(mockFunc.getMockName()).toBe("a mock name");
```
