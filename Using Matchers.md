# Using Matchers

Jest는 여러 방식으로 값들을 테스트하기 위해 "matchers"를 사용합니다.
이 문서에서는 흔하게 사용되는 matchers를 소개합니다.
자세한 사항은 해당 문서를 참고 바랍니다. ref: https://jestjs.io/docs/expect

## Common Matchers

완전히 일치하는 값을 테스트 하기 위한 가장 쉬운 방법

```javascript
test("two plus two is four", () => {
  expect(2 + 2).toBe(4);
});
```

코드에서, expect(2 + 2)는 기대(expectation) 객체를 반환합니다.  
기대 객체로 Matchers를 사용하는거 외에는 일반적으로 많은 작업을 하지는 않습니다.
.toBe(4)는 matcher입니다.  
Jest가 실행되면 실패한 matchers를 추적하여 에러 메시지를 출력합니다.

toBe는 정확히 일치하는지 테스트 하기 위해 Object.is를 사용합니다.
만약 객체의 값을 검증하길 원한다면 toEqual을 사용하세요.

- reference check만 함 ex. let person = { name: "CHOI", age: 25 }; let person2 = { ...person }; Object.is(person, person2) // false 즉 값은 같지만 두 객체의 메모리 주소가 다르기 때문에 Object.is에서 false

```javascript
test("object assignment", () => {
  const data = { one: 1 };
  data["two"] = 2;
  expect(data).toEqual({ one: 1, two: 2 });
});
```

toEqual은 재귀적으로 객체 또는 배열의 모든 속성을 검증합니다.

또한, 반대 기능의 matcher를 이용하여 테스트할 수 있습니다.

```javascript
test("adding positive number is not zero", () => {
  for (let a = 1; a < 10; a++) {
    for (let b = 1; b < 10; b++) {
      expect(a + b).not.toBe(0);
    }
  }
});
```
