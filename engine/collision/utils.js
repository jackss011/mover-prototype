


/**
 * 
 * @param {Array<T>} array 
 * @param {(a: T, b: T) => void} action
 */
export function pairs(array, action) {
  for(let i = 0; i < array.length - 1; i++)
    for(let j = i + 1; j < array.length; j++)
      action(array[i], array[j]);
}


/**
 * @param {Array<T>} arrayA
 * @param {Array<T>} arrayB
 * @param {(a: T, b: T) => void} action
 */
export function doublePairs(arrayA, arrayB, action) {
  arrayA.forEach(a => arrayB.forEach(b => action(a, b)));
}