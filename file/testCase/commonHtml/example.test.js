// import { multiply } from './example'
const path = require('path');
const example= require(path.join(__dirname, 'example'));


let window = globalThis
const isBrowser = typeof window !== 'undefined';
const isNavigator = typeof navigator !== 'undefined';


console.log(example)

describe('commonHTML', () => {

  test('chtml-base', () => {
    localStorage.setItem('foo', 'bar');
    expect(localStorage.getItem('foo')).toBe('bar' );
  })
  


})


