import util from 'util';

/**
 *
 * This function uses Node.js's `util.inspect` to convert an object into a string
 * with detailed information, including all nested properties. The output is colored
 * for better readability in the console.
 *
 * usage
 * console.log(deepLog(myObject));
 *
 * @param  obj - The object to be inspected and logged.
 */
export function deepLog(obj: any) {
  return util.inspect(obj, { showHidden: false, depth: null, colors: true });
}
