/**
 *
 * @param fun 要被执行的函数
 * @param delay 等待时间
 * @returns void
 */

export function throttle(fun: (...args: any) => any, delay: number) {
  delay = delay || 1000;
  let timer: number | null = null;
  return function (this: any, ...args: any[]) {
    const context = this;

    clearTimeout(timer as number);
    timer = setTimeout(function () {
      fun.apply(context, args);
      clearTimeout(timer as number);
    }, delay);
  };
}
