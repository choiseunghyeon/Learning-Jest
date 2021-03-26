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
