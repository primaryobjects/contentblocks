ContentBlocks
--------

Create simple editable CMS content blocks in node.js. Wrapper for Create.js CMS framework.

ContentBlocks is a wrapper for the Create.js CMS interface. It allows you to define CMS editable content blocks within your web pages by including HTML5 tags around your content. After adding the markup, simply click Edit in the Create.js toolbar to edit your content in-line on the page. Click Save to persist the data to your CMS back-end web service.

ContentBlocks includes a node.js module to pre-render CMS content upon page-load. It also includes pre-defined routes and REST web service integration for saving content back to the CMS. In short, ContentBlocks makes it easy to use the Create.js CMS framework in node.js

Demo http://contentblocks.herokuapp.com

```bash
$ npm install contentblocks
```

## About Create.js

From the Create.js web site @ http://createjs.org
"Create.js is a comprehensive web editing interface for Content Management Systems. It is designed to provide a modern, fully browser-based HTML5 environment for managing content. Create can be adapted to work on almost any content management backend."

## Usage

### app.js

```
var contentBlocks = require('contentblocks')({ app: app, host: 'red-ant.herokuapp.com', pathFind: '/v1/nest/find?q={"@subject":"[id]"}', pathPost: '/v1/nest', pathPut: '/v1/nest/[id]', pathDelete: '/v1/nest/[id]' });

app.configure(function(){
  ...
  app.use(contentBlocks.render); // Place this line BEFORE app.use(app.router) as it needs to pre-render content.
  app.use(app.router);
  ...
});
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
script(src='/scripts/create-min.js')
script(src='/scripts/contentblocks.js')

link(rel='stylesheet', href='/css/create-ui/css/create-ui.css')
link(rel='stylesheet', href='/css/midgard-notifications/midgardnotif.css')
```

## Configuration

Two changes need to be made to point to your own REST web service url for persisting the CMS content:

1. Replace the host and paths in the require('contentBlocks')({ ... }) statement, with your own CMS REST urls. ContentBlocks and Create.js are compatible with any CMS backend system that provides a REST interface (GET/POST/PUT/DELETE) for managing content.

2. Replace the value for "restUrl" in /scripts/contentblock.js to point to your web service "find" method.

For step 1, the paths should be specified as shown below. Use [id] as a placeholder in the url for where the actual content block id will be inserted automatically:

pathFind: web service path to Find method, example: '/v1/nest/find?q={"@subject":"[id]"}'

pathPost: web service path to Insert (POST) method, example: '/v1/nest'

pathPut: web service path to Update (PUT) method, example: '/v1/nest/[id]'

pathDelete: web service path to Delete (DELETE) method, example: '/v1/nest/[id]'

## Creating a CMS Content Block

The following Jade (HTML, etc) markup may be used to indicate editable CMS content blocks:

```
	#myContentBlock(style='font-size:16px; color:#00000;', about='MyContentBlock')
		div(property='content')
			if typeof(MyContentBlock_content) !== 'undefined'
				span!= MyContentBlock_content
			else
				[edit here]
```

For more details on available markup, see http://createjs.org/guide/#rdfa

## Notes

After setup, refresh your web page and you should see the Create.js toolbar along the top of the page. Click Edit to begin editing the content and click Save to save the content to the CMS. Upon clicking Save, the ContentBlocks module will call the REST web service url that you defined in the setup in order to persist the content to the CMS database.

You are welcome to use the demo REST web service url (red-ant.herokuapp.com, which loads and saves JSON objects to mongodb via REST). However, there is no gaurantee that the web service will remain active. It is recommended to point to your own REST web service, mongodb interface, or CMS.

## Author

Kory Becker
http://www.primaryobjects.com

View @ GitHub
https://github.com/primaryobjects/contentblocks