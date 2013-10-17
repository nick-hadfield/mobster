# A Framework for Creating Single Page Applications

Mobster has dependencies on [jQuery](http://jquery.com/), and [Knockout](http://knockoutjs.com/) and contains features for managing routes (<code>Router</code>), History (<code>Navigator</code>), and other miscellaneous utilities.

## The Router Class

The <code>Router</code> class can be used to detect changes to the url and parse out paths and parameters. I used to use asp.net mvc
to parse out querystring parameters server side and then inject them into the view/page so that I could make a subsequent
call to a json method. Using the <code>Router</code> class I can now serve up a static html page and parse out the parameters client side.
The html page can be cached in the browser and hence what used to always be two requests is now one.

```javascript
var router = new mobster.Router()
    .get('/', function (params) { console.log('Home: '); })
    .get('#hello', function (params) { window.alert('hello'; })
    .get('#world', function (params) { window.alert('world: ' + params['text']); })
    .get('#blah', function (params) { 
        require('/pages/blah/handler', function (handler) {
            handler.execute(params);
        });
    });

$(function() {
    router.execute();
});
```
## The Navigator Class

The <code>Navigator</code> class blah blah blah...

## Installation (using bower)

```bash
bower install mobster
```

## Installation (getting up and running)

```bash
npm install yeoman -g
npm install generator-webapp -g
yo webapp
bower install mobster
grunt bower
```
