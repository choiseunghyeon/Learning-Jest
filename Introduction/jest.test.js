const sum = require("./sum");

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});

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

test("adding floating point numbers", () => {
  const value = 0.1 + 0.2;
  //expect(value).toBe(0.3); This won't work because of rounding error
  expect(value).toBeCloseTo(0.3);
});

test("there is no I in team", () => {
  expect("team").not.toMatch(/I/);
});

test('but there is a "stop" in Christoph', () => {
  expect("Christoph").toMatch(/stop/);
});

const shoppingList = ["diapers", "kleenex", "trash bags", "paper towels", "beer"];

test("the shopping list has beer on it", () => {
  expect(shoppingList).toContain("beer");
  expect(new Set(shoppingList)).toContain("beer");
});

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
