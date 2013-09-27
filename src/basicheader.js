    var freeExports = typeof exports == 'object' && exports,
        freeModule = typeof module == 'object' && module && module.exports == freeExports && module,
        freeGlobal = typeof global == 'object' && global;
    if (freeGlobal.global === freeGlobal) {
        window = freeGlobal;
    }    

    var Rx = window.Rx,
        Subject = Rx.Subject,
        AsyncSubject = Rx.AsyncSubject,
        Observer = Rx.Observer,
        observerCreate = Observer.create,
        Observable = Rx.Observable,
        observableProto = Observable.prototype,
        observableCreate = Observable.create,
        observableCreateWithDisposable = Observable.createWithDisposable,
        CompositeDisposable = Rx.CompositeDisposable,
        disposableCreate = Rx.Disposable.create,
        disposableEmpty = Rx.Disposable.empty,
        Promise = WinJS.Promise,
        Binding = WinJS.Binding;
        
    Rx.WinJS = {};
