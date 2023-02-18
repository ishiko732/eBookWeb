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
  findValue: string | number,
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
        const Mathing = DFS(
          child,
          findValue,
          attribute,
          nextAttribute,
          visit.children[index],
          collected
        );
        isMathc = isMathc || Mathing;
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

export function DFS_path(
  nodes: any[],
  findValue: string,
  attribute: string,
  nextAttribute: string
) {
  const collected: any[] = [];
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    if (_DFS_path(node, findValue, attribute, nextAttribute, collected)) {
      break;
    }
  }
  return collected;
}

function _DFS_path(
  node: any,
  findValue: string,
  attribute: string,
  nextAttribute: string,
  collected: any[]
) {
  let isMathc = node[attribute] && node[attribute] === findValue;
  if (node[nextAttribute]?.length > 0) {
    for (let index = 0; index < node[nextAttribute].length; index++) {
      const child = node[nextAttribute][index];
      isMathc ||= _DFS_path(
        child,
        findValue,
        attribute,
        nextAttribute,
        collected
      );
      if (isMathc) {
        break;
      }
    }
  }
  if (isMathc) {
    collected.unshift(node);
    // console.log(node.id+':'+node.name)
  }
  return isMathc;
}

export function DFS_Delete(
  nodes: any[],
  attribute: string,
  nextAttribute: string,
  path: any[],
  path_index?: number
): boolean {
  let ret = false;
  const cnt = path_index || 0;
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    if (!node) {
      return false;
    }
    if (node[attribute] === path[cnt][attribute]) {
      if (path.length - 1 === cnt) {
        nodes.splice(index, index + 1);
        // delete nodes[index];
        return true;
      } else if (node[nextAttribute]?.length > 0) {
        ret = DFS_Delete(
          node[nextAttribute],
          attribute,
          nextAttribute,
          path,
          cnt + 1
        );
        if (ret) {
          break;
        }
      }
    }
  }
  return ret;
}

export function DFS_Rename(
  nodes: any[],
  uniqueId: string,
  attribute: string,
  nextAttribute: string,
  newValue: string,
  path: any[],
  path_index?: number
): boolean {
  let ret = false;
  const cnt = path_index || 0;
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    if (!node) {
      return false;
    }
    if (node[uniqueId] === path[cnt][uniqueId]) {
      if (path.length - 1 === cnt) {
        nodes[index][attribute] = newValue;
        // delete nodes[index];
        return true;
      } else if (node[nextAttribute]?.length > 0) {
        ret = DFS_Rename(
          node[nextAttribute],
          uniqueId,
          attribute,
          nextAttribute,
          newValue,
          path,
          cnt + 1
        );
        if (ret) {
          break;
        }
      }
    }
  }
  return ret;
}

export function DFS_Delete2(
  nodes: any[],
  attribute: string,
  findValue: any,
  nextAttribute: string
): boolean {
  let ret = false;
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    if (!node) {
      return false;
    }
    if (node[attribute] === findValue) {
      nodes.splice(index, index + 1);
      return true;
    } else if (node[nextAttribute]?.length > 0) {
      ret = DFS_Delete2(
        node[nextAttribute],
        attribute,
        findValue,
        nextAttribute
      );
      if (ret) {
        break;
      }
    }
  }
  return ret;
}
