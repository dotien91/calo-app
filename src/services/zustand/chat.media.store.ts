import create from "zustand";

// You need to wrap Maps and Sets inside an object,
// and when you want it's update to be reflected
// (e.g. in React), you do it by calling the setState on it:
export const useFooBar = create(() => ({ foo: new Map(), bar: new Set() }));

// Without wrapping it in an object, it doesn't work.
const useTheWrongWay = create(() => new Set());

const wrong = 0;
let foo = 0;
let bar = 0;

function updateFoo() {
  ++foo;

  // If you want to update some React component that
  // uses `useFooBar`, you have to call setState
  // to let React know that an update happened.
  // Following React's best practices, you should
  // create a new Map/Set when updating them:
  useFooBar.setState((prev) => ({
    foo: new Map(prev.foo).set(foo, foo),
  }));
}

export const updateBar = () => {
  ++bar;
  useFooBar.setState((prev) => ({
    bar: new Set(prev.bar).add(bar),
  }));
};
