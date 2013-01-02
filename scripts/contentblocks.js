//
// Url to your REST CMS web service 'find' interface. This is the method that checks if a content block already exists.
// The service should accept GET/POST/PUT/UPDATE/DELETE with a JSON object. [id] will be replaced by the CMS content block id.
// Example: http://your.service.com/api/findById?id=[id]
//
var restUrl = 'http://red-ant.herokuapp.com/v1/nest/find?q={"@subject": "[id]"}';

$(document).ready(function () {
	$('body').midgardCreate({
		/*url: function () {
			return 'http://red-ant.herokuapp.com/v1/nest';
		},*/
		metadata: {
			midgardTags: {}
		},
		collectionWidgets: {
			'default': 'midgardCollectionAdd',
			'skos:related': null
		}
	});

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

// Fake Backbone.sync since there is no server to communicate with
Backbone.sync = function(method, model, options) {
	if (method == 'create') {
	    $.ajax({
	        url: '/create',
	        type: 'POST',
	        data: CommonManager.cleanCreateId(JSON.stringify(model)),
	        contentType: 'application/json',
	        dataType: 'json',
	        success: function (data) {
	            options.success(model);
	        }
	    });
	}
	else if (method == 'read') {
	    alert(model.id);
	}
	else if (method == 'update') {		
		$.ajax({
		    url: restUrl.replace('[id]', CommonManager.encodeId(model.id)),
			type: 'GET',
			dataType: 'jsonp',
			success: function(data) {
			    if (data.length == 0) {
			        // Create new entry.	
			        $.ajax({
			            url: '/create',
			            type: 'POST',
			            data: CommonManager.encodeId(JSON.stringify(model)),
						contentType: 'application/json',
						dataType: 'json',
						success: function(data) {
							options.success(model);
						}
					});
				}
				else {
					// Update existing entry.
					$.ajax({
					    url: '/create/' + data[0]._id,
						type: 'PUT',
						data: CommonManager.encodeId(JSON.stringify(model)),
						contentType: 'application/json',
						dataType: 'json',
						success: function(data) {
						    options.success(model);
						}
					});
				}
			}
		});		
	}
	else if (method == 'delete') {
	    $.ajax({
	        url: '/create/' + data[0]._id,
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
    }
};