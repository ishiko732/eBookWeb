export const timer = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const fetchMockData: (data: any, ms: number) => Promise<any> = (
  data: any,
  ms: number
) => {
  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      resolve(data);
    }, ms);
  });
};

export async function task(cnt?: number) {
  if (!cnt) {
    cnt = 1;
  }
  for (let i = 0; i < cnt; i++) {
    await timer(1000);
    console.log("延迟1s");
  }
}
