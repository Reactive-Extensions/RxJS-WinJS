RxJS-WinJS <sup>1.0</sup> - WinJS Bindings for the Reactive Extensions for JavaScript 
==========================================================
## OVERVIEW

This project provides Reactive Extensions for JavaScript (RxJS) bindings for WinJS which includes support for HTML DOM objects to abstract over the event binding and Ajax requests via promises.  This also bridges to HTML5 features such as Web Workers, WebSockets, MutationObservers and more, in addition to support for sensors as well.  The RxJS libraries are not included with this release and must be installed separately.

## GETTING STARTED

There are a number of ways to get started with the WinJS Bindings for RxJS.  

### Download the Source

To download the source of the WinJSBindings for the Reactive Extensions for JavaScript, type in the following:

    git clone https://github.com/Reactive-Extensions/rxjs-winjs.git
    cd ./rxjs-winjs

## GETTING STARTED

There are a number of ways to get started with the Windows 8 and WinJS Bindings Bindings for RxJS.  

### Download the Source

To download the source of the WinJS Bindings for the Reactive Extensions for JavaScript, type in the following:

    git clone https://github.com/Reactive-Extensions/rxjs-winjs.git
    cd ./rxjs-winjs

### Installing with [NPM](https://npmjs.org/)

	npm install rx-winjs

### Installing with [Bower](http://bower.io/)

	bower install rx-winjs

### Installing with [Jam](http://jamjs.org/)
	
	jam install rx-winjs

### Installing with [NuGet](http://nuget.org)

	PM> Install-Package RxJS-Bridges-winjs	

### Implemented Bindings

There are a number of bridges to features for both HTML5 and WinJS features such as the following:

#### Events

* `Rx.WinJS.fromEvent`

#### Binding

* `WinJS.Binding.as`

#### Geolocation

* `Rx.WinJS.Geolocation`
	* `Rx.WinJS.Geolocation.getCurrentPosition`	
	* `Rx.WinJS.Geolocation.watchPosition`		

#### WebSockets

* `Rx.WinJS.fromWebSocket`

#### Web Workers

* `Rx.WinJS.fromWebWorker`

#### Promises

* `WinJS.Promise.toObservable`
* `WinJS.Promise.prototype.toObservable`
* `Rx.Observable.prototype.toPromise`

#### Sesnsors

* `Rx.WinJS.fromSensorEvent`

* `Rx.WinJS.Accelerometer`
	* `Rx.WinJS.Accelerometer.readingChanged`
	* `Rx.WinJS.Accelerometer.shaken`

* `Rx.WinJS.Compass`
	* `Rx.WinJS.Accelerometer.readingChanged`

* `Rx.WinJS.Compass`
	* `Rx.WinJS.Accelerometer.readingChanged`

* `Rx.WinJS.Gryometer`
	* `Rx.WinJS.Gryometer.readingChanged`

* `Rx.WinJS.Inclinometer`
	* `Rx.WinJS.Inclinometer.readingChanged`	

* `Rx.WinJS.LightSensor`
	* `Rx.WinJS.LightSensor.readingChanged`

* `Rx.WinJS.OrientationSensor`
	* `Rx.WinJS.OrientationSensor.readingChanged`

* `Rx.WinJS.SimpleOrientationSensor`
	* `Rx.WinJS.SimpleOrientationSensor.orientationChanged`	

##  API Documentation ##

You can find the documentation [here](https://github.com/Reactive-Extensions/RxJS-WinJS/tree/master/doc) as well as examples [here](https://github.com/Reactive-Extensions/RxJS-WinJS/tree/master/examples).

## Contributing ##

There are lots of ways to [contribute](https://github.com/Reactive-Extensions/rxjs-winjs/wiki/Contributing) to the project, and we appreciate our [contributors](https://github.com/Reactive-Extensions/rxjs-winjs/wiki/Contributors).

You can contribute by reviewing and sending feedback on code checkins, suggesting and trying out new features as they are implemented, submit bugs and help us verify fixes as they are checked in, as well as submit code fixes or code contributions of your own. Note that all code submissions will be rigorously reviewed and tested by the Rx Team, and only those that meet an extremely high bar for both quality and design/roadmap appropriateness will be merged into the source.

## License ##

Copyright (c) Microsoft Open Technologies, Inc.  All rights reserved.
Microsoft Open Technologies would like to thank its contributors, a list
of whom are at http://rx.codeplex.com/wikipage?title=Contributors.

Licensed under the Apache License, Version 2.0 (the "License"); you
may not use this file except in compliance with the License. You may
obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing permissions
and limitations under the License.