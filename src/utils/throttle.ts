/**
 *
 * @param fun 要被执行的函数
 * @param delay 等待时间
 * @return Function
 */

export function throttle(fun: (...args: any) => any, delay?: number) {
  delay = delay || 1000;
  let timer: number | null = null;

  return function (this: any, ...args: any[]) {
    const _this = this;

    // 若计时器已经开启，直接return
    if (timer) return;

    timer = setTimeout(function () {
      // 重新设置计时器，延时delay后执行当前回调函数
      fun.apply(_this, args);
      timer = null;
    }, delay);
  };
}
