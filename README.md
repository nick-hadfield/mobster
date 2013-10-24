Mobster
=======

Mobster has dependencies on [jQuery](http://jquery.com/), and [Knockout](http://knockoutjs.com/) and contains features for handling
routes (_Router_), history (_Navigator_), and other classes for managing web page content (_View_, _Content_, and _Target_).

## The Router Class

The _Router_ class can be used to detect changes to the url and parse out paths and parameters. I used to use asp.net mvc
to parse out querystring parameters server side and then inject them into the view/page so that I could make a subsequent
call to a json method. Using the _Router_ class I can now serve up a static html page and parse out the parameters client side.
The html page can be cached in the browser and hence what used to always be two requests is now one.

```javascript
var router = new mobster.Router()
    .pre(function(context) {
        context.startedAt = new Date();
    })
    .end(function(context) {
        var ms = (new Date()).valueOf() - context.startedAt.valueOf();
        console.log('Routing ' + context.route + ' completed in ' + ms + 'ms.');
    })
    .get('#hello', function (context) {
        window.alert('Hello ' + context.params.name);
    });

$(function() {
    router.execute();
});
```

## View, Content, Target

You can inject content into a page using the code below. Knockout's _applyBindings_ occurs inside the _Content_ constructor.

```javascript
var view = new mobster.View().setHtml('<h1>Hello</h1>');
var model = new Model();
var content = new mobster.Content(view, model);
var target = new mobster.Target('#id');
target.setContent(content);
```

In addition the the _setHtml_ method, the _View_ object also supports _setTemplate_ which will load the a script template with the
specified id.

```javascript
var view = new mobster.View().setTemplate('hello-template');
```

## Installation (using bower)

```bash
bower install https://bitbucket.org/avalier/mobster.git
```

## Installation (getting up and running)

Firstly, you should ensure that you're node environment has a few tools handy.
[Bower](http://bower.io/), [Grunt](http://gruntjs.com/), and [Yeoman](http://yeoman.io/), as well as a webapp generator for yeoman.

```bash
npm install bower -g
npm install grunt-cli -g
npm install yo -g
npm install generator-webapp -g
```

Next you should create a folder for your project. Once inside the folder execute the following.

```bash
yo webapp
bower install https://bitbucket.org/avalier/mobster.git
grunt bower
```

You can then modify the _/app/scripts/app.js_ to read something like the following...

```javascript
define(['jquery', 'mobster'], function ($, mobster) {
    'use strict';

    var router = new mobster.Router()
        .pre(function(context) {
            context.startedAt = new Date();
        })
        .end(function(context) {
            var ms = (new Date()).valueOf() - context.startedAt.valueOf();
            mobster.f.log('Routing ' + context.uri.url + ' completed in ' + ms + 'ms.');
        })
        .get('#hello', function(context) { window.alert('Hello'); })

    $(function() { router.execute(); });
});
```

You can then test your application using the following.

```bash
grunt server
```



