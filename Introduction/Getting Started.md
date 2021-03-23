## 시작하기

npm install --save-dev jest

Note: Jest 문서는 yarn을 사용하지만 npm 또한 사용가능합니다.

두 숫자를 더하는 함수의 테스트 코드 작성으로 시작해 보도록 하겠습니다.
먼저, sum.js 을 만드세요

```javascript
function sum(a, b) {
  return a + b;
}
module.exports = sum;
```

다음으로 sum.test.js 를 만드세요

```javascript
const sum = require("./sum");

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});
```

package.json에 다음과 같이 추가 해주세요

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

마지막으로 npm run test 를 실행시키면 Jest는 다음과 같은 메시지를 출력합니다.

```
PASS  ./sum.test.js
✓ adds 1 + 2 to equal 3 (5ms)
```

테스트에 사용되는 expect와 toBe는 두 개의 값이 정확히 같은지 테스트 합니다.
