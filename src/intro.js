(function (root, factory) {
    var freeExports = typeof exports == 'object' && exports,
        freeModule = typeof module == 'object' && module && module.exports == freeExports && module,
        freeGlobal = typeof global == 'object' && global;
    if (freeGlobal.global === freeGlobal) {
        window = freeGlobal;
    }

    // Because of build optimizers
    if (typeof define === 'function' && define.amd) {
        define(['rx', 'winjs', 'exports'], function (Rx, winjs, exports) {
            root.Rx = factory(root, exports, Rx, winjs);
            return root.Rx;
        });
    } else if (typeof module === 'object' && module && module.exports === freeExports) {
        module.exports = factory(root, module.exports, require('rx'), require('winjs'));
    } else {
        root.Rx = factory(root, {}, root.Rx, root.WinJS);
    }
}(this, function (global, exp, Rx, WinJS, undefined) {