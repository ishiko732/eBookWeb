/**
 * 查找指定元素所在的节点并返回
 * @param { Array } arr         要查找的节点所在的原数组
 * @param { String } findValue  要查找的节点值
 * @param { String } attribute   要查找的节点属性值
 * @param { String } nextAttribute 如果本级未找到，指定下级
 * @returns 返回该节点所在的对象
 */
export function findItem(
  arr: any[],
  findValue: string,
  attribute: string,
  nextAttribute: string
): any {
  // eslint-disable-next-line array-callback-return
  return arr.reduce((previousValue, currentValue) => {
    if (previousValue) return previousValue;
    if (currentValue[attribute] === findValue) return currentValue;
    if (currentValue[nextAttribute])
      return findItem(
        currentValue[nextAttribute],
        findValue,
        attribute,
        nextAttribute
      );
  }, null);
}
