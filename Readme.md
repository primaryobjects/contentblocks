ContentBlocks
--------

Create simple editable CMS content blocks in node.js. Wrapper for Create.js CMS framework.

ContentBlocks is a wrapper for the Create.js CMS interface. It allows you to define CMS editable content blocks within your web pages by including HTML5 tags around your content. After adding the markup, simply click Edit in the Create.js toolbar to edit your content in-line on the page. Click Save to persist the data to your CMS back-end web service.

ContentBlocks includes a node.js module to pre-render CMS content upon page-load. It also includes pre-defined routes and REST web service integration for saving content back to the CMS. In short, ContentBlocks makes it easy to use the Create.js CMS framework in node.js

Demo http://contentblocks.herokuapp.com

Demo Source https://github.com/primaryobjects/contentblocks-demo

```bash
$ npm install contentblocks
```

## About Create.js

From the Create.js web site @ http://createjs.org
"Create.js is a comprehensive web editing interface for Content Management Systems. It is designed to provide a modern, fully browser-based HTML5 environment for managing content. Create can be adapted to work on almost any content management backend."

## Usage

### app.js

```
var app = express();
var contentBlocks = require('contentblocks')({ app: app, host: 'red-ant.herokuapp.com', port: 80, pathFind: '/v1/nest/find?q={"@subject":"[id]"}', pathPost: '/v1/nest', pathPut: '/v1/nest/[id]', pathDelete: '/v1/nest/[id]' });

app.use(contentBlocks.render); // Place this line in your app.use() section, so it can pre-render content.
```

### web site

Copy the contents of node_modules/contentblocks/scripts into your web site javascript folder. These contain the CMS user interface controls.

Copy the contents of node_modules/contentblocks/css into your web site css folder. These contain the CMS user interface styles.

In your web site footer view (footer.jade, etc), include the scripts and css:

```
script(src='http://code.jquery.com/ui/1.9.2/jquery-ui.js')
script(src='/scripts/underscore-min.js')
script(src='/scripts/backbone-min.js')
script(src='/scripts/vie-min.js')
script(src='/scripts/jquery.tagsinput.min.js')
script(src='/scripts/jquery.rdfquery.min.js')
script(src='/scripts/annotate-min.js')
script(src='/scripts/rangy-core-1.2.3.js')
script(src='/scripts/hallo-min.js')
script(src='/scripts/aloha/lib/require.js')
script(src='/scripts/aloha/lib/aloha-full.min.js', data-aloha-plugins='common/ui,common/format,common/link,common/image,extra/sourceview')
script(src='/scripts/create-min.js')
script(src='/scripts/contentblocks.js')

link(rel='stylesheet', href='/css/aloha/css/aloha.css')
link(rel='stylesheet', href='/css/aloha/css/aloha-common-extra.css')
link(rel='stylesheet', href='/css/aloha/css/aloha-core.css')
link(rel='stylesheet', href='/css/aloha/css/aloha-reset.css')
link(rel='stylesheet', href='/css/aloha/css/aloha-sidebar.css')
link(rel='stylesheet', href='/css/create-ui/css/create-ui.css')
link(rel='stylesheet', href='/css/midgard-notifications/midgardnotif.css')
```

## Configuration

Two changes need to be made to point to your own REST web service url for persisting the CMS content:

1. Replace the host and paths in the require('contentBlocks')({ ... }) statement, with your own CMS REST urls. ContentBlocks and Create.js are compatible with any CMS backend system that provides a REST interface (GET/POST/PUT/DELETE) for managing content.

2. Replace the value for "restUrl" in /scripts/contentblocks.js to point to your web service "find" method.

For step 1, the paths should be specified as shown below. Use [id] as a placeholder in the url for where the actual content block id will be inserted automatically:

pathFind: web service path to Find method, example: '/v1/nest/find?q={"@subject":"[id]"}'

pathPost: web service path to Insert (POST) method, example: '/v1/nest'

pathPut: web service path to Update (PUT) method, example: '/v1/nest/[id]'

pathDelete: web service path to Delete (DELETE) method, example: '/v1/nest/[id]'

## Configuration for localhost REST Service

If you are not using a remote REST service to store your CMS data, you can instead have contentblocks post back to your local app to load and save content blocks. For a working example, see the ContentBlocks Demo on [localhost](https://github.com/primaryobjects/contentblocks-demo/tree/localhost).

To do this, make the following changes:

1. In [scripts/contentblocks.js](https://github.com/primaryobjects/contentblocks-demo/blob/localhost/public/scripts/contentblocks.js#L6), set the value for "restUrl" to point to localhost, For example:
```
var restUrl = 'http://localhost:3000/cms/find?q={"@subject": "[id]"}';
```

2. In [scripts/contentblocks.js](https://github.com/primaryobjects/contentblocks-demo/blob/localhost/public/scripts/contentblocks.js#L84) line 84, change the dataType from "jsonp" to "json":
```
dataType: 'json',
```

3. In your [app.js](https://github.com/primaryobjects/contentblocks-demo/blob/localhost/app.js#L16), set the contentBlocks initialization line to point to localhost. For example:
```
var contentBlocks = require('contentblocks')({ app: app, host: 'localhost', port: 3000, pathFind: '/cms/find?q={"@subject":"[id]"}', pathPost: '/cms', pathPut: '/cms/[id]', pathDelete: '/cms/[id]' });
```

4. In [app.js](https://github.com/primaryobjects/contentblocks-demo/blob/localhost/app.js#L8), at the top of the file, add a line to include your routes code:
```
var cms = require('./routes/cms');
```

5. In [app.js](https://github.com/primaryobjects/contentblocks-demo/blob/localhost/app.js#L33-L38), add routes for the CMS calls:
```
// REST API routes.
app.get('/cms/find', cms.find);
app.get('/cms/:itemId', cms.get);
app.put('/cms/:itemId', cms.update);
app.delete('/cms/:itemId', cms.delete);
app.post('/cms', cms.insert);
```

6. Create a folder under /routes/cms, with a file [index.js](https://github.com/primaryobjects/contentblocks-demo/blob/localhost/routes/cms/index.js), that will contain your route controller code. These methods will respond to the get, post, put, delete to load data from your database. See the ContentBlocks Demo [localhost](https://github.com/primaryobjects/contentblocks-demo/tree/localhost) for a complete working example.

## Creating a CMS Content Block

The following Jade (HTML, etc) markup may be used to indicate editable CMS content blocks:

```
    #myContentBlock(style='font-size:16px; color:#00000;', about='MyContentBlock')
        div(property='content')
            if typeof(MyContentBlock_content) !== 'undefined'
                != MyContentBlock_content
            else
                | [edit here]
```

For more details on available markup, see http://createjs.org/guide/#rdfa

## Showing the Controls to Administrator Users Only

To restrict editing of the CMS content to specific users, you can use a url parameter to enable and disable the CMS controls. For example, the following url (containing the parameter admin=1) could allow editing of the CMS blocks on the page:

```
http://localhost:3000/?admin=1
```

To do this, first wrap your script and css references in an if/then block, as shown below. This could be placed in your footer.jade file:

```
if isAdmin
    script(src='http://code.jquery.com/ui/1.9.2/jquery-ui.js')
    script(src='/scripts/underscore-min.js')
    script(src='/scripts/backbone-min.js')
    script(src='/scripts/vie-min.js')
    script(src='/scripts/jquery.tagsinput.min.js')
    script(src='/scripts/jquery.rdfquery.min.js')
    script(src='/scripts/annotate-min.js')
    script(src='/scripts/rangy-core-1.2.3.js')
    script(src='/scripts/hallo-min.js')
    script(src='/scripts/aloha/lib/require.js')
    script(src='/scripts/aloha/lib/aloha-full.min.js', data-aloha-plugins='common/ui,common/format,common/link,common/image,extra/sourceview')
    script(src='/scripts/create-min.js')
    script(src='/scripts/contentblocks.js')

    link(rel='stylesheet', href='/css/aloha/css/aloha.css')
    link(rel='stylesheet', href='/css/aloha/css/aloha-common-extra.css')
    link(rel='stylesheet', href='/css/aloha/css/aloha-core.css')
    link(rel='stylesheet', href='/css/aloha/css/aloha-reset.css')
    link(rel='stylesheet', href='/css/aloha/css/aloha-sidebar.css')
    link(rel='stylesheet', href='/css/create-ui/css/create-ui.css')
    link(rel='stylesheet', href='/css/midgard-notifications/midgardnotif.css')
```

Next, in the route for your view, include a value for isAdmin, indicating if the current user should be able to edit the CMS blocks, as follows:

```
var remoteip = require('remoteip');

exports.index = function (req, res) {
    res.render('index', { isAdmin: isCurrentUserAdministrator(req) });
};

function isCurrentUserAdministrator(req) {
    var adminIp = remoteip.get(req);
    return ((adminIp == '123.456.789.012' || adminIp == '127.0.0.1') && req.query['admin'] == '1');
}
```

That's it! If you load the page without the url parameter, you should not see the CMS controls. If you add the parameter admin=1 to the url, you should see the controls displayed.

## Notes

After setup, refresh your web page and you should see the Create.js toolbar along the top of the page. Click Edit to begin editing the content and click Save to save the content to the CMS. Upon clicking Save, the ContentBlocks module will call the REST web service url that you defined in the setup in order to persist the content to the CMS database.

You are welcome to use the demo REST web service url (red-ant.herokuapp.com, which loads and saves JSON objects to mongodb via REST). However, there is no gaurantee that the web service will remain active. It is recommended to point to your own REST web service, mongodb interface, or CMS.

## Author

Kory Becker
http://www.primaryobjects.com

View @ GitHub
https://github.com/primaryobjects/contentblocks
