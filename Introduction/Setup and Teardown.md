# Setup and Teardown

test를 실행하기 전 설정 작업 및 끝난 후에 마무리 작업이 필요한 경우가 있습니다.
Jest는 이러한 설정 작업에 필요한 함수를 제공합니다.

## Repeating Setup For Many Tests - 여러 테스트를 위한 반복 설정

여러 테스트에 대해 여러 반복 작업이 필요한 경우 beforeEach, afterEach를 사용할 수 있습니다.

몇개의 test가 db와 상호 작용한다고 가정해봅시다.

initializeCityDatabase method는 각 테스트를 실행하기 전에 호출되어야 합니다.  
clearCityDatabase method는 각 테스트가 실행된 이후 호출되어야 합니다.

```javascript
beforeEach(() => {
  initializeCityDatabase();
});

afterEach(() => {
  clearCityDatabase();
});

test("city database has Vienna", () => {
  expect(isCity("Vienna")).toBeTruthy();
});

test("city database has San Juan", () => {
  expect(isCity("San Juan")).toBeTruthy();
});
```

beforeEach나 afterEach도 비동기 코드를 Testing Async Code에서 배운 것과 같은 방식으로 처리할 수 있습니다.
they can either take a done parameter or return a promise. For example, if initializeCityDatabase() returned a promise that resolved when the database was initialized, we would want to return that promise:

```javascript
beforeEach(() => {
  return initializeCityDatabase();
});
```

## One-Time Setup - 일회성 설정

설정 작업을 단 한번만 해줘야 하는 경우가 있습니다.  
파일의 시작 부분에 설정 작업이 비동기적으로 처리 된다면 매우 성가시게 됩니다.
Jest는 이러한 상황을 해결하기 위해 beforeAll, afterAll 함수를 제공합니다.

initializeCityDatabase, clearCityDatabase가 promise를 반환하고 city db가 tests 사이에서 재사용된다면 다음과 같이 코드를 수정할 수 있습니다.

```javascript
beforeAll(() => {
  return initializeCityDatabase();
});

afterAll(() => {
  return clearCityDatabase();
});

test("city database has Vienna", () => {
  expect(isCity("Vienna")).toBeTruthy();
});

test("city database has San Juan", () => {
  expect(isCity("San Juan")).toBeTruthy();
});
```

## Scoping - 범위

기본적으로, before, after 는 파일안에 있는 모든 테스트에 적용됩니다.
describe를 사용하여 tests를 그룹화할 수도 있습니다.
before, after가 describe 안에서 사용되면 해당 블록에 있는 tests에만 적용됩니다.

city db만 있는게 아니라 food db도 있다고 가정합시다.
각 tests를 다르게 설정할 수도 있습니다.

```javascript
// Applies to all tests in this file
beforeEach(() => {
  return initializeCityDatabase();
});

test("city database has Vienna", () => {
  expect(isCity("Vienna")).toBeTruthy();
});

test("city database has San Juan", () => {
  expect(isCity("San Juan")).toBeTruthy();
});

describe("matching cities to foods", () => {
  // Applies only to tests in this describe block
  beforeEach(() => {
    return initializeFoodDatabase();
  });

  test("Vienna <3 sausave", () => {
    expect(isValidCityFoodPair("Vienna", "Wiener Schnitzel")).toBe(true);
  });

  test("San Juan <3 Plantains", () => {
    expect(isValidCityFoodPair("San Juan", "Mofongo")).toBe(true);
  });
});
```

Note: describe안에 있는 beforeEach가 실행되기 전에 최상위에 있는 beforeEach 가 실행됩니다.  
It may help to illustrate the order of execution of all hooks.

```javascript
beforeAll(() => console.log("1 - beforeAll"));
afterAll(() => console.log("1 - afterAll"));
beforeEach(() => console.log("1 - beforeEach"));
afterEach(() => console.log("1 - afterEach"));
test("", () => console.log("1 - test"));
describe("Scoped / Nested block", () => {
  beforeAll(() => console.log("2 - beforeAll"));
  afterAll(() => console.log("2 - afterAll"));
  beforeEach(() => console.log("2 - beforeEach"));
  afterEach(() => console.log("2 - afterEach"));
  test("", () => console.log("2 - test"));
});

// 1 - beforeAll
// 1 - beforeEach
// 1 - test
// 1 - afterEach
// 2 - beforeAll
// 1 - beforeEach
// 2 - beforeEach
// 2 - test
// 2 - afterEach
// 1 - afterEach
// 2 - afterAll
// 1 - afterAll
```

## Order of execution of describe and test blocks - describe와 test block의 실행 순서

Jest는 실제 test가 실행되기 전에 파일 안에 있는 모든 describe를 실행합니다.  
describe 내부가 아닌 before*, after* 에서 설정 작업 및 분해를 하는 또 다른 이유입니다.  
describe가 완료 되면, Jest는 모든 test를 collection phase에서 발생한 순서대로 실행합니다.  
그리고 각 테스트가 완료될 때까지 기다렸다가 계속 진행됩니다.

Consider the following illustrative test file and output:

```javascript
describe("outer", () => {
  console.log("describe outer-a");

  describe("describe inner 1", () => {
    console.log("describe inner 1");
    test("test 1", () => {
      console.log("test for describe inner 1");
      expect(true).toEqual(true);
    });
  });

  console.log("describe outer-b");

  test("test 1", () => {
    console.log("test for describe outer");
    expect(true).toEqual(true);
  });

  describe("describe inner 2", () => {
    console.log("describe inner 2");
    test("test for describe inner 2", () => {
      console.log("test for describe inner 2");
      expect(false).toEqual(false);
    });
  });

  console.log("describe outer-c");
});

// describe outer-a
// describe inner 1
// describe outer-b
// describe inner 2
// describe outer-c
// test for describe inner 1
// test for describe outer
// test for describe inner 2
```

## General Advice

test가 실패할 때 가장 먼저 확인해야 할 사항 중 하나는 유일하게 실행되는 test가 실패하는지 여부입니다.
test를 하나만 실행시키고 싶다면 잠시동안 test 명령어를 test.only로 바꾸십시오.

```javascript
test.only("this will be the only test that runs", () => {
  expect(true).toBe(false);
});

test("thie test will not run", () => {
  expect("A").toBe("A");
});
```

큰 규모의 test suite에서 가끔 어떤 test가 실패하지만 유일하게 실행 했을 때 실패하지 않는다면 다른 test가 영향을 주고 있다고 의심해볼만 하다.  
beforeEach를 사용하여 공유되는 state를 지우면 이 문제를 해결할 수 있다.  
공유되는 state가 수정되고 있는지 확실하지 않다면 beforeEach에서 data를 log로 찍어서 확인해 보자.
