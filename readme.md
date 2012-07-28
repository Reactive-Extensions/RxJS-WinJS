Windows 8 and WinJS Bindings for the Reactive Extensions for JavaScript
=======================================================================
## OVERVIEW

This project provides Reactive Extensions for JavaScript (RxJS) bindings for Windows 8 and WinJS to abstract over the event binding, Promises, Sensors and Observable Bindings.  The RxJS libraries are not included with this release and must be installed separately.

## GETTING STARTED

There are a number of ways to get started with the Windows 8 and WinJS Bindings Bindings for RxJS.  

### Download the Source

To download the source of the jQuery Bindings for the Reactive Extensions for JavaScript, type in the following:

    git clone https://github.com/Reactive-Extensions/rxjs-winjs.git
    cd ./rxjs-winjs

 ### Installing with NuGet

	Coming Soon

### Implemented Bindings
* Events
 * Rx.Observable.fromEvent

* Binding
 * WinJS.Binding.as - toObservable

* Promises
 * Promise.toObservable
 * Promise.prototype.toObservable
 * Rx.Observable.prototype.toPromise

* Sensors
 * Rx.Observable.fromAccelerometer - readingchanged event
 * Rx.Observable.fromGyrometer - readingchanged event

## LICENSE

Copyright 2012 Microsoft Corporation

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
  [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.