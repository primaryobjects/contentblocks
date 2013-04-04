var cheerio = require('cheerio'),
    commonManager = require('./managers/CommonManager'),
    controllerManager = require('./managers/ControllerManager'),
    cache = require('memory-cache');

module.exports = function (params) {
    if (params.app == null || params.host == null || params.pathFind == null || params.pathPost == null || params.pathPut == null) {
        console.log('*** ContentBlocks.js module requires the following parameters:');
        console.log('*** app: express application instance');
        console.log('*** host: hostname of CMS REST web service');
        console.log('*** pathFind: web service path to Find method');
        console.log('*** pathPost: web service path to Insert (POST) method');
        console.log('*** pathPut: web service path to Update (PUT) method');
        console.log('*** pathDelete: web service path to Delete (DELETE) method');
        console.log('*** Example:');
        console.log('*** var contentBlocks = require(\'contentblocks\')({ app: app, host: \'red-ant.herokuapp.com\', pathFind: \'/v1/nest/find?q={"@subject":"[id]"}\', pathPost: \'/v1/nest\', pathPut: \'/v1/nest/[id]\', pathDelete: \'/v1/nest/[id]\' });');

        return;
    }

    var app = params.app;
    var init = false;

    return {
        render: function (req, res, next) {
            var _render = res.render;

            if (!init) {
                // Initialize routes.
                ControllerManager.setup(app, params.host, params.pathPost, params.pathPut, params.pathDelete);
                init = true;
            }

            // Override res.render to add additional locals.
            res.render = function (view, options, callback) {
                app.render(view, options, function (err, html) {
                    var list = [];

                    // Load html into parser.
                    $ = cheerio.load(html);

                    // Find all CMS elements in the view by searching for the 'about' attribute.
                    var contentBlocks = $('[about]');

                    // Pack each CMS element into an array.
                    contentBlocks.each(function (i, elem) {
                        var contentBlock = $(this);

                        // Get the CMS element id. We'll need this to set the view value by 'id_propertyId'.
                        var id = contentBlock.attr('about');
                        id = '<' + CommonManager.encodeId(id) + '>';

                        // Create the CMS element object.
                        var item = {};
                        item.id = id;
                        item.host = params.host;
                        item.path = params.pathFind.replace('[id]', id);
                        item.contentBlock = contentBlock;

                        // Add the item to the array.
                        list.push(item);
                    });

                    // Wrap the ascynchronous function WebManager.send() so we can execute all the array items at once.
                    var webManagerSendSync = function (contentBlockItems, index) {
                        // Check if we're finished reading the list.
                        if (index < contentBlockItems.length) {
                            // Process a CMS element.
                            var contentBlockItem = contentBlockItems[index];

                            var result = cache.get(contentBlockItem.id);
                            if (result != null && result.length > 0) {
                                // Populate the html content from cache.
                                ContentBlockManager.processHtml(contentBlockItem, options, result);

                                // console.log('Loaded ' + contentBlockItem.id + ' from cache.');

                                // Recurse to the next CMS element.
                                webManagerSendSync(contentBlockItems, index + 1);
                            }
                            else {
                                // Load the CMS document from the database.
                                WebManager.send(req, res, contentBlockItem.host, contentBlockItem.path, 'GET', function (result) {
                                    if (result != null && result.length > 0) {
                                        // Cache the result.
                                        cache.put(contentBlockItem.id, result);

                                        // Populate the html content.
                                        ContentBlockManager.processHtml(contentBlockItem, options, result);

                                        // console.log('Loaded ' + contentBlockItem.id + ' from database.');
                                    }

                                    // Recurse to the next CMS element.
                                    webManagerSendSync(contentBlockItems, index + 1);
                                });
                            }
                        }
                        else {
                            // Render to the browser.
                            _render.call(res, view, options, callback);
                        }
                    }

                    // Call the asynchronous WebManager.send() method for all CMS elements that we found.
                    webManagerSendSync(list, 0);
                });
            }

            if (next) {
                next();
            }
        }
    }
};

ContentBlockManager = {
    processHtml: function (contentBlockItem, options, result) {
        // Find all properties in the CMS element.
        var properties = contentBlockItem.contentBlock.find('[property]');

        // Add each property, along with its CMS element id, to the session variable, options.
        properties.each(function (i, elem) {
            var property = $(this);
            var propertyId = property.attr('property');

            // Get the value to display from the database document.
            var val = CommonManager.decodeId(result[0][CommonManager.encodeId('<http://viejs.org/ns/' + propertyId + '>')])

            // console.log('Found: <http://viejs.org/ns/' + propertyId + '> = ' + val);

            // Add the resulting id/value to the session variable, options.
            options[contentBlockItem.id.replace(/</, '').replace(/>/, '') + '_' + propertyId] = val;
        });
    }
};