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

## Truthiness

테스트를 하다 보면 가끔 undefined, null, false를 구분할 필요가 있습니다.  
하지만, 이것들을 다르게 처리하고 싶지 않을 수도 있습니다.  
Jest는 명시적으로 구분해주는 것들을 포함하고 있습니다.

- toBeNull matches only null
- toBeUndefined matches only undefined
- toBeDefined is the opposite of toBeUndfeind
- toBeTruthy matches anything that an if statement treats as true
- toBeFalsy matches anything that an if statement treats as false

```javascript
test("null", () => {
  const n = null;
  expect(n).toBeNull();
  expect(n).toBeDefined();
  expect(n).not.toBeUndefined();
  expect(n).not.toBeTruthy();
  expect(n).toBeFalsy();
});
test("zero", () => {
  const n = 0;
  expect(n).not.toBeNull();
  expect(n).toBeDefined();
  expect(n).not.toBeUndefined();
  expect(n).not.toBeTruthy();
  expect(n).toBeFalsy();
});
```

## Numbers

숫자 비교에 사용할 수 있는 Matcher가 있습니다.

```javascript
test("two plus two", () => {
  const value = 2 + 2;
  expect(value).toBeGreaterThan(3);
  expect(value).toBeGreaterThanOrEqual(3.5);
  expect(value).toBeLessThan(5);
  expect(value).toBeLessThanOrEqual(4.5);

  // toBe나 toEqual이나 똑같다.
  expect(value).toBe(4);
  expect(value).toEqual(4);
});
```

부동 소수점의 경우 toEqual 대신 toBeCloseTo를 사용하세요.

```javascript
test("adding floating point numbers", () => {
  const value = 0.1 + 0.2;
  //expect(value).toBe(0.3); This won't work because of rounding error
  expect(value).toBeCloseTo(0.3);
});
```

## Strings

toMatch를 사용하여 정규 표현식에 대한 문자열을 확인할 수 있습니다.

```javascript
test("there is no I in team", () => {
  expect("team").not.toMatch(/I/);
});

test('but there is a "stop" in Christoph', () => {
  expect("Christoph").toMatch(/stop/);
});
```

## Arrays and iterables

toContain을 사용하여 array 또는 iterable이 특정 요소를 가지고 있는 확인할 수 있습니다.

```javascript
const shoppingList = ["diapers", "kleenex", "trash bags", "paper towels", "beer"];

test("the shopping list has beer on it", () => {
  expect(shoppingList).toContain("beer");
  expect(new Set(shoppingList)).toContain("beer");
});
```

## Exceptions

특정 함수가 호출될 때 예외를 잘 발생시키는지 확인하려면 toThrow를 사용하세요.

```javascript
function compiledAndroidCode() {
  throw new Error("you are using the wrong JDK");
}

test("compiling android goes as expected", () => {
  expect(() => compiledAndroidCode()).toThrow();
  expect(() => compiledAndroidCode()).toThrow(Error);

  // 에러 메시지 또는 정규표현식을 사용할 수 있습니다.
  expect(() => compiledAndroidCode()).toThrow("you are using the wrong JDK");
  expect(() => compiledAndroidCode()).toThrow(/JDK/);
});
```

Note: 예외를 발생시켜주는 함수는 wrapping 함수로 감싸줄 필요가 있습니다. 그렇지 않으면 toThrow가 실패합니다.
