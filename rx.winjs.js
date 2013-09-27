// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.txt in the project root for license information.
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
}(this, function (global, exp, Rx, WinJS, undefined) {    var freeExports = typeof exports == 'object' && exports,
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
    function createEventListener(el, eventName, handler) {
        var disposables = new CompositeDisposable();

        function createListener(element, en, fn) {
            element.addEventListener(en, fn, false);
            return disposableCreate(function () {
                element.removeEventListener(en, fn, false);
            });
        };

        // Assume collection versus single
        if (el && el.length) {
            for (var i = 0, len = el.length; i < len; i++) {
                disposables.add(createEventListener(el[i], eventName, handler));
            }
        } else {
            disposables.add(createListener(el, eventName, handler));
        }

        return disposables;
    }

    /**
     * Binds an event to a given element or item.  This supports either a single object or a collection.
     *
     * @param {Element|NodeList} element The element or object to bind the event to.
     * @param {String} eventName The name of the event to bind to the given element
     * @returns {Observable} An observable sequence which listens to the event on the given element or object
     */
    Rx.WinJS.fromEvent = function (element, eventName) {
        return observableCreateWithDisposable(function (observer) {
            return createEventListener(element, eventName, observer.onNext.bind(observer));
        }).publish().refCount();
    };
    /**
     * Converts an existing WinJS Promise object to an observable sequence with an optional observer for progress.
     * @param {Function|Observer} [observerOrOnNext] An optional Observer or onNext function to capture progress events. 
     * @returns {Observable} An observable sequence wrapping an existing WinJS Promise object.   
     */
    Promise.prototype.toObservable = function (observerOrOnNext) {

        var subject = new AsyncSubject();
        this.done(
            function (next) {
                subject.onNext(next);
                subject.onCompleted();
            }, 
            subject.onError.bind(subject), 
            function (progress) {
                if (typeof observerOrOnNext === 'function') {
                    observerOrOnNext(progress);
                } else if (observerOrOnNext) {
                    observerOrOnNext.onNext(progress);
                }
            }
        );
        return subject.asObservable();
    };

    /**
     * Converts an existing Observable to a WinJS Promise object.
     * @returns {WinJS.Promise} A WinJS Promise object which encapsulates the given Observable sequence.
     */     
    observableProto.toPromise = function () {

        var parent = this, subscription, value;
        return new Promise(function (c, e) {
            subscription = parent.subscribe(function (v) {
                value = v;
            }, function (exn) {
                e(exn);
            }, function () {
                c(value);
            });
        }, function () {
            if (subscription) { subscription.dispose(); }
        });
    };

    /**
     * Converts an existing WinJS Promise object to an observable sequence with an optional observer for progress.
     * @param {WinJS.Promise} promise The Promise to convert to an Observable sequence. 
     * @param {Function|Observer} [observerOrOnNext] An optional Observer or onNext function to capture progress events. 
     * @returns {Observable} An observable sequence wrapping an existing WinJS Promise object.
     */
    Promise.toObservable = function (promise, observerOrOnNext) {
        return Promise.prototype.toObservable.call(promise, observerOrOnNext);
    };    var originalAs = Binding.as;

    function bindObservable(bindable, name) {
        return observableCreate(function (observer) {
            var handler = function (newValue, oldValue) {
                observer.onNext({
                    name: name,
                    newValue: newValue,
                    oldValue: oldValue,
                    dataObject: bindable
                });
            };
            bindable.bind(name, handler);
            return function () {
                bindable.unbind(name, handler);
            };
        });
    }

    /**
     * Returns an observable object. This may be an observable proxy for the specified object, an existing proxy, or
     * the specified object itself if it directly supports observability.
     * This also adds a `toObservable` method which allows to turn the given binding object into an observable object.
     * 
     * @param {Object} data Object to provide observability for.
     * 
     * @returns {Observable} The observable object.
     */
    Binding.as = function (data) {
        var bindable = originalAs(data);
        bindable.toObservable = function () {
            if (arguments.length === 0) {
                throw new Error('Must have at least one binding');
            }
            var observables = [];
            for (var i = 0, len = arguments.length; i < len; i++) {
                observables.push(bindObservable(bindable, arguments[i]));
            }
            return Observable.merge(observables);
        };

        return bindable;
    };

    if (window.MutationObserver) {

        /**
         * Creates an observable sequence from a Mutation Observer.
         * MutationObserver provides developers a way to react to changes in a DOM.
         * @example
         *  Rx.DOM.fromMutationObserver(document.getElementById('foo'), { attributes: true, childList: true, characterData: true });
         *
         * @param {Object} target The Node on which to obserave DOM mutations.
         * @param {Object} options A MutationObserverInit object, specifies which DOM mutations should be reported.
         * @returns {Observable} An observable sequence which contains mutations on the given DOM target.
         */
        Rx.WinJS.fromMutationObserver = function (target, options) {

            return observableCreate(function (observer) {
                var mutationObserver = new MutationObserver(function (mutations) {
                    observer.onNext(mutations);
                });

                mutationObserver.observe(target, options);

                return function () {
                    mutationObserver.disconnect();
                };
            });

        };

    }
     /**
     * Creates a WebSocket Subject with a given URL, protocol and an optional observer for the open event.
     * 
     * @example
     *  var socket = Rx.DOM.fromWebSocket('http://localhost:8080', 'stock-protocol', function(e) { ... });
     *  var socket = Rx.DOM.fromWebSocket('http://localhost:8080', 'stock-protocol', observer);
     *
     * @param {String} url The URL of the WebSocket.
     * @param {String} protocol The protocol of the WebSocket.
     * @param {Function|Observer} [observerOrOnNext] An optional Observer or onNext function to capture the open event.
     * @returns {Subject} An observable sequence wrapping a WebSocket.
     */
    Rx.WinJS.fromWebSocket = function (url, protocol, observerOrOnNext) {
        var socket = new window.WebSocket(url, protocol);

        var observable = observableCreate(function (obs) {
            if (observerOrOnNext) {
                socket.onopen = function (openEvent) {
                    if (typeof observerOrOnNext === 'function') {
                        observerOrOnNext(openEvent);
                    } else if (observerOrOnNext.onNext) {
                        observerOrOnNext.onNext(openEvent);
                    }
                };
            }

            socket.onmessage = function (data) {
                obs.onNext(data);
            };

            socket.onerror = function (err) {
                obs.onError(err);
            };

            socket.onclose = function () {
                obs.onCompleted();
            };

            return function () {
                socket.close();
            };
        });

        var observer = observerCreate(function (data) {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(data);
            }
        });

        return Subject.create(observer, observable);
    }; 
    if (window.Worker) {
        /**
         * Creates a Web Worker with a given URL as a Subject.
         * 
         * @example
         * var worker = Rx.DOM.fromWebWorker('worker.js');
         *
         * @param {String} url The URL of the Web Worker.
         * @returns {Subject} A Subject wrapping the Web Worker.
         */
        Rx.WinJS.fromWebWorker = function (url) {
            var worker = new window.Worker(url);

            var observable = observableCreateWithDisposable(function (obs) {
                worker.onmessage = function (data) {
                    obs.onNext(data);
                };

                worker.onerror = function (err) {
                    obs.onError(err);
                };

                return disposableCreate(function () {
                    worker.close();
                });
            });

            var observer = observerCreate(function (data) {
                worker.postMessage(data);
            });

            return Subject.create(observer, observable);
        };      
    }    Rx.WinJS.Geolocation = {

        /**
         * Obtains the geographic position, in terms of latitude and longitude coordinates, of the device.
        * @param {Object} [geolocationOptions] An object literal to specify one or more of the following attributes and desired values:
        *   - enableHighAccuracy: Specify true to obtain the most accurate position possible, or false to optimize in favor of performance and power consumption.
        *   - timeout: An Integer value that indicates the time, in milliseconds, allowed for obtaining the position.
        *              If timeout is Infinity, (the default value) the location request will not time out.
        *              If timeout is zero (0) or negative, the results depend on the behavior of the location provider.
        *   - maximumAge: An Integer value indicating the maximum age, in milliseconds, of cached position information.
        *                 If maximumAge is non-zero, and a cached position that is no older than maximumAge is available, the cached position is used instead of obtaining an updated location.
        *                 If maximumAge is zero (0), watchPosition always tries to obtain an updated position, even if a cached position is already available.
        *                 If maximumAge is Infinity, any cached position is used, regardless of its age, and watchPosition only tries to obtain an updated position if no cached position data exists.
        * @returns {AsyncSubject} An observable sequence with the geographical location of the device running the client.
        */
        getCurrentPosition: function (geolocationOptions) {
            var subject = new Rx.AsyncSubject();

            window.navigator.geolocation.getCurrentPosition(
                function successHandler (loc) {
                    subject.onNext(loc);
                    subject.onCompleted();                    
                }, 
                function errorHandler (err) {
                    subject.onError(err);
                }, 
                geolocationOptions);

            return subject.asObservable();
        },

        /**
        * Begins listening for updates to the current geographical location of the device running the client.
        * @param {Object} [geolocationOptions] An object literal to specify one or more of the following attributes and desired values:
        *   - enableHighAccuracy: Specify true to obtain the most accurate position possible, or false to optimize in favor of performance and power consumption.
        *   - timeout: An Integer value that indicates the time, in milliseconds, allowed for obtaining the position.
        *              If timeout is Infinity, (the default value) the location request will not time out.
        *              If timeout is zero (0) or negative, the results depend on the behavior of the location provider.
        *   - maximumAge: An Integer value indicating the maximum age, in milliseconds, of cached position information.
        *                 If maximumAge is non-zero, and a cached position that is no older than maximumAge is available, the cached position is used instead of obtaining an updated location.
        *                 If maximumAge is zero (0), watchPosition always tries to obtain an updated position, even if a cached position is already available.
        *                 If maximumAge is Infinity, any cached position is used, regardless of its age, and watchPosition only tries to obtain an updated position if no cached position data exists.
        * @returns {Observable} An observable sequence with the current geographical location of the device running the client.
        */ 
        watchPosition: function (geolocationOptions) {
            return observableCreate(function (observer) {
                var watchId = window.navigator.geolocation.watchPosition(
                    function successHandler (loc) {
                        observer.onNext(loc);
                    }, 
                    function errorHandler (err) {
                        observer.onError(err);
                    }, 
                    geolocationOptions);

                return function () {
                    window.navigator.geolocation.clearWatch(watchId);
                };
            }).publish().refCount();
        }
    };
    /**
     * Creates a wrapper for listening to WinJS sensor's events.
     * @param {Object} sensor The WinJS sensor to attach the event listener.
     * @param {String} eventName The event name to listen for.
     * @returns {Observable} An observable sequence wrapping the Sensor's given event event.
    */   
    var fromSensorEvent = Rx.WinJS.fromSensorEvent = function (sensor, eventName) {
        return observableCreateWithDisposable(function (observer) {
           
           if (!sensor) {
               observer.onError('Sensor not supported');
               return disposableEmpty;
           }
           
           function handler(eventData) {
               observer.onNext(eventData);
           }
           
           sensor.addEventListener(sensor, eventName, false);
           
           return disposableCreate(function () {
               sensor.removeEventListener(sensor, eventName, false);
           });
        }).publish().refCount();
    };
    var accelerometer = Windows.Devices.Sensors.Accelerometer.getDefault();

    Rx.WinJS.Accelerometer = {

        /**
         * Creates a wrapper for the Accelerometer which listens for the readingchanged event.
         * @returns {Observable} An observable sequence wrapping the Accelerometer's readingchanged event.
        */   
        readingChanged: function () {
            return fromSensorEvent(accelerometer, 'readingchanged');
        },

        /**
         * Creates a wrapper for the Accelerometer which listens for the shaken event.
         * @returns {Observable} An observable sequence wrapping the Accelerometer's shaken event.
        */  
        shaken: function () {
            return fromSensorEvent(accelerometer, 'shaken');
        }
    }  
	var compass = Windows.Devices.Sensors.Compass.getDefault();

	Rx.WinJS.Compass = {
        /**
         * Creates a wrapper for the Compass which listens for the readingchanged event.
         * @returns {Observable} An observable sequence wrapping the Compass's readingchanged event.
        */   
		readingChanged: function () {
			return fromSensorEvent(compass, 'readingchanged');
		}
	};
    var lightSensor = Windows.Devices.Sensors.LightSensor.getDefault();

    Rx.WinJS.LightSensor = {
         /**
         * Creates a wrapper for the LightSensor which listens for the readingchanged event.
         * @returns {Observable} An observable sequence wrapping the LightSensor's readingchanged event.
         */
        readingChanged: function () {
            return fromSensorEvent(lightSensor, 'readingchanged');
        }  
    };
    var orientationSensor = Windows.Devices.Sensors.OrientationSensor.getDefault();

    Rx.WinJS.OrientationSensor = {
         /**
         * Creates a wrapper for the OrientationSensor which listens for the readingchanged event.
         * @returns {Observable} An observable sequence wrapping the OrientationSensor's readingchanged event.
         */
        readingChanged: function () {
            return fromSensorEvent(orientationSensor, 'readingchanged');
        }  
    };
    var simpleOrientationSensor = Windows.Devices.Sensors.SimpleOrientationSensor.getDefault();

    Rx.WinJS.SimpleOrientationSensor = {
         /**
         * Creates a wrapper for the SimpleOrientationSensor which listens for the orientationchanged event.
         * @returns {Observable} An observable sequence wrapping the SimpleOrientationSensor's orientationchanged event.
         */
        orientationChanged: function (reportInterval) {
            return fromSensorEvent(simpleOrientationSensor, 'orientationchanged');
        }  
    };

    // Get the right animation frame method
    var requestAnimFrame, cancelAnimFrame;
    if (window.requestAnimationFrame) {
        requestAnimFrame = window.requestAnimationFrame;
        cancelAnimFrame = window.cancelAnimationFrame;
    } else if (window.mozRequestAnimationFrame) {
        requestAnimFrame = window.mozRequestAnimationFrame;
        cancelAnimFrame = window.mozCancelAnimationFrame;
    } else if (window.webkitRequestAnimationFrame) {
        requestAnimFrame = window.webkitRequestAnimationFrame;
        cancelAnimFrame = window.webkitCancelAnimationFrame;
    } else if (window.msRequestAnimationFrame) {
        requestAnimFrame = window.msRequestAnimationFrame;
        cancelAnimFrame = window.msCancelAnimationFrame;
    } else if (window.oRequestAnimationFrame) {
        requestAnimFrame = window.oRequestAnimationFrame;
        cancelAnimFrame = window.oCancelAnimationFrame;    
    } else {
        requestAnimFrame = function(cb) { window.setTimeout(cb, 1000 / 60); };
        cancelAnimFrame = window.clearTimeout;
    }

    /** 
     * Gets a scheduler that schedules schedules work on the requestAnimationFrame for immediate actions.
     *
     * @memberOf Scheduler
     */
    Scheduler.requestAnimationFrame = (function () {

        var defaultNow = (function () { return !!Date.now ? Date.now : function () { return +new Date; }; }());

        function scheduleNow(state, action) {
            var scheduler = this,
                disposable = new SingleAssignmentDisposable();
            var id = requestAnimFrame(function () {
                if (!disposable.isDisposed) {
                    disposable.setDisposable(action(scheduler, state));
                }
            });
            return new CompositeDisposable(disposable, disposableCreate(function () {
                cancelAnimFrame(id);
            }));
        }

        function scheduleRelative(state, dueTime, action) {
            var scheduler = this,
                dt = Scheduler.normalize(dueTime);
            if (dt === 0) {
                return scheduler.scheduleWithState(state, action);
            }

            var disposable = new SingleAssignmentDisposable(),
                id;
            var scheduleFunc = function () {
                if (id) { cancelAnimFrame(id); }
                if (dt - scheduler.now() <= 0) {
                    if (!disposable.isDisposed) {
                        disposable.setDisposable(action(scheduler, state));
                    }
                } else {
                    id = requestAnimFrame(scheduleFunc);
                }
            };

            id = requestAnimFrame(scheduleFunc);

            return new CompositeDisposable(disposable, disposableCreate(function () {
                cancelAnimFrame(id);
            }));
        }

        function scheduleAbsolute(state, dueTime, action) {
            return this.scheduleWithRelativeAndState(state, dueTime - this.now(), action);
        }

        return new Scheduler(defaultNow, scheduleNow, scheduleRelative, scheduleAbsolute);        

    }());
        // Check for mutation observer
    var BrowserMutationObserver = window.MutationObserver;
    if (BrowserMutationObserver) {

        /**
         * Scheduler that uses a MutationObserver changes as the scheduling mechanism
         * @memberOf {Scheduler}
         */
        Scheduler.mutationObserver = (function () {

            var queue = {}, queueId = 0;

            function cloneObj (obj) {
                var newObj = {};
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        newObj[prop] = obj[prop];
                    }
                }
                return newObj;
            }

            var observer = new BrowserMutationObserver(function() {
                var toProcess = cloneObj(queue);
                queue = {};

                for (var prop in toProcess) {
                    if (toProcess.hasOwnProperty(prop)) {
                        toProcess[prop]();
                    }
                }
            });

            var element = document.createElement('div');
            observer.observe(element, { attributes: true });

            // Prevent leaks
            window.addEventListener('unload', function () {
                observer.disconnect();
                observer = null;
            }, false);

            function scheduleMethod (action) {
                var id = queueId++;
                queue[id] = action;
                element.setAttribute('drainQueue', 'drainQueue');
                return id;
            }

            function cancelMethod (id) {
                delete queue[id];
            }

            function defaultNow () { return new Date().getTime(); }

            function scheduleNow(state, action) {
                var scheduler = this,
                    disposable = new SingleAssignmentDisposable();
                var id = scheduleMethod(function () {
                    if (!disposable.isDisposed) {
                        disposable.setDisposable(action(scheduler, state));
                    }
                });
                return disposable;
            }

            function scheduleRelative(state, dueTime, action) {
                var scheduler = this,
                    dt = Scheduler.normalize(dueTime);
                if (dt === 0) {
                    return scheduler.scheduleWithState(state, action);
                }

                var disposable = new SingleAssignmentDisposable(),
                    id;
                var scheduleFunc = function () {
                    if (id) { cancelMethod(id); }
                    if (dt - scheduler.now() <= 0) {
                        if (!disposable.isDisposed) {
                            disposable.setDisposable(action(scheduler, state));
                        }
                    } else {
                        id = scheduleMethod(scheduleFunc);
                    }
                };

                id = scheduleMethod(scheduleFunc);

                return new CompositeDisposable(disposable, disposableCreate(function () {
                    cancelMethod(id);
                }));
            }

            function scheduleAbsolute(state, dueTime, action) {
                return this.scheduleWithRelativeAndState(state, dueTime - this.now(), action);
            }

            return new Scheduler(defaultNow, scheduleNow, scheduleRelative, scheduleAbsolute);  
        }());
    }

    return Rx;
}));