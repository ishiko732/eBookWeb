export const timer = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function task() {
  await timer(1000);
  console.log("延迟1s");
}
