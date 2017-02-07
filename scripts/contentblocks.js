// Url to your REST CMS web service 'find' interface. This is the method that checks if a content block already exists.
// The service should accept GET/POST/PUT/UPDATE/DELETE with a JSON object.
// Example: http://your.service.com/api/findById?id=[id]
//
var restUrl = function (method, id) {
    // Customize this method according to your REST CMS web service setup
    var base_url = 'http://red-ant.herokuapp.com';
    var rest_url = base_url + '/create';
    if (method === 'FIND') {
        return base_url + '/v1/nest/find?q={"@subject": "' + id + '"}';
    }
    else if (method === 'POST') {
        return rest_url;
    }
    else {
        return rest_url + '/' + id;
    }
};

var apiKey = 'ykwLDRspn5XgZPkO'; // Unique key for the demo REST web service, red-ant.herokuapp.com. If you use the demo service, change this key to be unique. If using your own service, you can leave this blank.
var editor = 'aloha'; // Editor can be aloha or hallo.
var loaded = false;

$(document).ready(function () {
    if (editor == 'aloha') {
        // Enable Aloha editor.
        $('body').midgardCreate({
            // Use Aloha for all text editing
            editorWidgets: {
                'default': 'aloha'
            },
            editorOptions: {
                aloha: {
                    widget: 'alohaWidget'
                }
            },
            collectionWidgets: {
                'default': null,
                'feature': 'midgardCollectionAdd'
            },
            state: 'edit'
        });
    }
    else {
        // Enable Hallo editor.
        $('body').midgardCreate({
            metadata: {
                midgardTags: {}
            },
            collectionWidgets: {
                'default': 'midgardCollectionAdd',
                'skos:related': null
            },
            state: 'edit'
        });
    }

    // Set a simpler editor for title fields
    $('body').midgardCreate('configureEditor', 'title', 'halloWidget', {
        plugins: {
            halloformat: {},
            halloblacklist: {
                tags: ['br']
            }
        }
    });

    $('body').midgardCreate('setEditorForProperty', 'dcterms:title', 'title');

    // Disable editing of author fields
    $('body').midgardCreate('setEditorForProperty', 'dcterms:author', null);
});

// Backbone.sync
Backbone.sync = function (method, model, options) {
    // Include web service key.
    CommonManager.addApiKey(model, apiKey);

    if (method == 'create') {
        $.ajax({
            url: restUrl('POST', null),
            type: 'POST',
            data: CommonManager.encodeId(JSON.stringify(model)),
            contentType: 'application/json',
            dataType: 'json',
            success: function (data) {
                options.success(model);
            }
        });
    }
    else if (method == 'read') {
    }
    else if (method == 'update') {
        $.ajax({
            url: restUrl('FIND', CommonManager.encodeId(model.id)),
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                if (data.length == 0) {
                    // Create new entry.
                    console.log('CREATE ENTRY');
                    $.ajax({
                        url: restUrl('POST', null),
                        type: 'POST',
                        data: CommonManager.encodeId(JSON.stringify(model)),
                        contentType: 'application/json',
                        dataType: 'json',
                        success: function (data) {
                            options.success(model);
                        }
                    });
                }
                else {
                    // Update existing entry.
                    $.ajax({
                        url: restUrl('PUT', data[0]._id),
                        type: 'PUT',
                        data: CommonManager.encodeId(JSON.stringify(model)),
                        contentType: 'application/json',
                        dataType: 'json',
                        success: function (data) {
                            options.success(model);
                        }
                    });
                }
            }
        });
    }
    else if (method == 'delete') {
        $.ajax({
            url: restUrl('DELETE', data[0]._id),
            type: 'DELETE',
            contentType: 'application/json',
            dataType: 'json',
            success: function (data) {
                options.success(model);
            }
        });
    }
};

CommonManager = {
    encodeId: function (id) {
        id = id.replace(/\./g, '_p').replace(/\//g, '_s');

        return id;
    },

    decodeId: function (id) {
        id = id.replace(/_p/g, '.').replace(/_s/g, '/');

        return id;
    },

    addApiKey: function (model, apikey) {
        if (apiKey.length > 0) {
            model['apiKey'] = apiKey;

            if (!loaded) {
                // Copy original stringify method.
                model.toJSONOld = model.toJSON;

                // Override method to include apiKey.
                model.toJSON = function () {
                    var j = model.toJSONOld();
                    j.apiKey = model.apiKey;

                    return j;
                }

                loaded = true;
            }
        }
    }
};