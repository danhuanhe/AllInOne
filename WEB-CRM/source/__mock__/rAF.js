/**
 * jest官方应该在17年10月后发布的版本中更新了rAF的pollyfill
 * https://github.com/facebook/jest/commit/216e8edbe8ca60b34688d03e8ef3cb7262104b51
 */

if (!global.requestAnimationFrame) {

  const jsdomInitialized = process.hrtime();

  global.requestAnimationFrame = callback => {

    const hr = process.hrtime(jsdomInitialized);
    const hrInNano = hr[0] * 1e9 + hr[1];
    const hrInMicro = hrInNano / 1e6;

    return global.setTimeout(callback, 0, hrInMicro);
  };
}

//https://github.com/facebook/jest/pull/4780
if (!global.cancelAnimationFrame) {
  global.cancelAnimationFrame = id => {
    return global.clearTimeout(id);
  };
}
