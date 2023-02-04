/**
 * 查找指定元素所在的结点并返回
 * @param { Array } arr         要查找的结点所在的原数组
 * @param { String } findValue  要查找的结点值
 * @param { String } attribute   要查找的结点属性值
 * @param { String } nextAttribute 如果本级未找到，指定下级
 * @returns 返回该结点所在的对象
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

function filter(data: any, matchedNodes: any[]) {
  return data
    .filter((item: any) => matchedNodes.indexOf(item) > -1)
    .map((item: any) => ({
      ...item,
      children: item.children ? filter(item.children, matchedNodes) : [],
    }));
}
interface visited_DFS {
  visited: boolean;
  children: visited_DFS[];
}

export function DFS_Full(
  nodes: any[],
  findValue: string,
  attribute: string,
  nextAttribute: string
) {
  const visited: visited_DFS[] = Array.from({ length: nodes.length }, () => ({
    visited: false,
    children: [],
  }));
  const collected: any[] = [];
  nodes.forEach((node, index) => {
    DFS(node, findValue, attribute, nextAttribute, visited[index], collected);
  });
  return collected;
}

export function DFS(
  node: any,
  findValue: string,
  attribute: string,
  nextAttribute: string,
  visit: visited_DFS,
  collected: any[]
) {
  visit.visited = true;
  // console.log("进入:"+node.name)
  // console.log(node[nextAttribute])
  let isMathc = node[attribute] && node[attribute].indexOf(findValue) > -1;
  if (node[nextAttribute]?.length > 0) {
    visit.children = Array.from({ length: node[nextAttribute].length }, () => ({
      visited: false,
      children: [],
    }));
    node[nextAttribute].forEach((child: any, index: number) => {
      // console.log("遍历DFS:"+child.name+':'+index)
      if (!visit.children[index].visited) {
        const Mathing=DFS(
          child,
          findValue,
          attribute,
          nextAttribute,
          visit.children[index],
          collected
        );
        isMathc=isMathc||Mathing
        // console.log("DFS结束:"+child.name+':'+index+" find:"+Mathing)
      }
    });
  }
  if (isMathc) {
    collected.push(node);
    // console.log(node.id+':'+node.name)
  }
  return isMathc;
}
export function search(
  dates: any[],
  findValue: string,
  attribute: string,
  nextAttribute: string
) {
  const collected: any[] = DFS_Full(dates, findValue, attribute, nextAttribute);
  return {
    filter: filter(dates, collected),
    loaded: collected.map((node) => {
      return node.id;
    }),
  };
}
