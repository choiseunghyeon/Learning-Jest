# Testing Asynchronous Code

비동기 코드는 JS에서 일반적입니다.  
비동기적으로 실행되는 코드가 있다면 Jest는 테스트중인 코드가 완료되는 시점을 알아야 다른 테스트를 진행할 수 있습니다.  
Jest는 이를 처리하는 여러 방법이 있습니다.

## Callbacks

가장 흔한 비동기 코드 패턴은 callback입니다.
fetchData(callback)이 있다고 가정합시다.
fetchData는 data를 가져오는 것을 완료하면 callback(data)를 호출합니다.
data의 return 값이 'peanut butter' 라는 것을 테스트 하려고 합니다.

기본적으로, Jest 테스트는 실행이 끝나면 완료됩니다.
즉 아래의 테스트는 의도대로 작동하지 않습니다.

```javascript
// Don't do this
test("the data is peanut butter", () => {
  function callback(data) {
    expect(data).toBe("peanut butter");
  }

  fetchData(callback);
});
```

요지는 callback 함수가 호출되기 전에 fetchData가 끝나는대로 테스트는 완료될 것입니다.

이 문제를 해결하는 다른 형태의 테스트가 있습니다.
빈 argument를 가진 함수에 test를 넣는 것 대신에
done이라고 부르는 argument를 가진 함수를 사용합니다.
Jest는 test가 끝나기 전에 done callback이 호출될 때 까지 기다립니다.

```javascript
test("the data is peanut butter", done => {
  function callback(data) {
    try {
      expect(data).toBe("peanut butter");
      done();
    } catch (error) {
      done(error);
    }
  }

  fetchData(callback);
});
```

만약 done 함수가 호출되지 않는다면 테스트는 timeout error로 실패할 것입니다.

만약 expect가 실패한다면 error를 던져주고 done은 호출되지 않습니다.
실패한 이유를 test log에서 보고 싶다면, try 안에 expect를 사용해야 합니다. 그리고 catch 안에서는 done에 error를 넣어주어야 합니다.
그렇지 않으면 expect(data)에 어떤 값이 반환 되었는지 확인할 수 없습니다.

## Promises

promises를 사용하고 있다면 비동기 코드를 테스트 하는 더 확실한 방법이 있습니다.  
test에서 promise를 반환하면 Jest는 promise가 resolve 할 때 까지 기다립니다.  
만약 rejected 된다면 test는 실패될 것입니다.

예를 들어, fetchData가 callback을 사용하는 것 대신에 'peanut butter'를 resolve 하는 promise를 반환 한다면 다음과 같이 테스트할 수 있습니다.

```javascript
test("the data is peanut butter", () => {
  return fetchData().then(data => {
    expect(data).toBe("peanut butter");
  });
});
```

반드시 promise가 반환되어야 합니다.  
만약 return statement를 생략한다면 fetchData가 resolve되어 then에 있는 callback 함수를 실행하기 전에 테스트는 끝날 것입니다.

promise가 reject 되길 기대한다면, .catch method를 사용하세요  
그리고 특정 숫자의 assertion이 호출되는지 확인하려면 expect.assertions를 사용하세요 그렇지 않으면 fulfilled promise는 테스트를 실패시키지 않을 것입니다.

```javascript
test("the fetch fails with an error", () => {
  expect.assetions(1);
  return fetchData().catch(e => expect(e).toMatch("error"));
});
```

**_ .resolved / .rejects _**
expect statement에 .resolves matcher를 사용할 수 있습니다.  
Jest는 promise가 resolve 될 때 까지 기다립니다.  
promise가 reject 된다면 test는 실패할 것 입니다.

```javascript
test("the data is peanut butter", () => {
  return expect(fetchData()).resolve.toBe("peanut butter");
});
```

반드시 assertion이 반환되어야 합니다.  
만약 return statement를 생략한다면 fetchData가 resolve되어 then에 있는 callback 함수를 실행하기 전에 테스트는 끝날 것입니다.

rejects 또한 resolve와 유사하게 동작합니다.
promise가 fulfilled되었다면 test는 자동으로 실패될 것입니다.

```javascript
test("the fetch fails with an error", () => {
  return expect(fetchData()).rejects.toMatch("error");
});
```

## Async / Await

테스트에서 async / await을 사용할 수도 있습니다.  
async test를 작성하려면 test에 넘겨주는 function 앞에 async를 붙여야 합니다.

```javascript
test("the data is peanut butter", async () => {
  const data = await fetchData();
  expect(data).toBe("peanut butter");
});

test("the fetch fails with an error", async () => {
  expect.assertions(1);
  try {
    await fetchData();
  } catch (e) {
    expect(e).toMatch("error");
  }
});
```

async/await을 .resolves 또는 .rejects와 함께 사용할 수도 있습니다.

```javascript
test("the data is peanut butter", async () => {
  await expect(fetchData()).resolves.toBe("peanut butter");
});

test("the fetch fails with an error", async () => {
  await expect(fetchData()).rejects.toMatch("error");
});
```
