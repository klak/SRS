/*

what funcs do we need?

-list documents in given collection
	-with parameters... maybe we don't need this
-insert document
-get document by id
-update document by id... we might not even need this.
-delete document by id

what else??

*/

// we're assuming jquery is already here.

var baseUrl = "https://api.mongolab.com/api/1";
// so yeah, maybe this key shouldn't just be sitting here...
// for now, whatever. maybe later we can save it encrypted, 
// and decrypt it before we use it? that's slightly better than nothing.
var apiKey = "gM0pp-zc-_PDhEGzCAGLxs6j9EgjWfPv";

function listCollections(dbName)
{
	// GET /databases/{database}/collections
	var ajaxUrl = baseUrl + "/databases/" + dbName 
				+ "/collections?apiKey=" + apiKey;

	console.log("listCollections: sending GET to " + ajaxUrl);

	/*
	// here we make a promise to the caller that we will
	// give them the response when it's ready. trust me.
	// caller should then use listCollections().then(function(data)...)
	// or listCollections().success(function(data)...) to get at results
	*/

	return $.get(ajaxUrl);
};


function getAllDocuments(dbName, collectionName)
{
	// GET /databases/{database}/collections/{collection}


};


/*function getDocById(dbName, collectionName, docId)
{
	// TODO: probably don't need this... just use query func with id as attr
};*/

function getDocsWithQuery(dbName, collectionName, query)
{
	// retrieve docs that match query
	/*
	GET /databases/{database}/collections/{collection}

	Example listing all documents in a given collection:
	https://api.mongolab.com/api/1/databases/my-db/collections/my-coll?apiKey=myAPIKey

	Optional parameters
	[q=<query>][&c=true][&f=<fields>][&fo=true][&s=<order>][&sk=<skip>][&l=<limit>]
	*/


};


function updateDocById(dbName, collectionName, docId, attr, attrVal)
{
	// for doc, set attr to attrVal

	/*
	PUT /databases/{database}/collections/{collection}/{_id}
	Content-Type: application/json 
	Body: <JSON data>

	Example replace the matching document with { "x" : 2 } (using jQuery): 

	$.ajax( { url: "https://api.mongolab.com/api/1/databases/my-db/collections/my-coll/4e7315a65e4ce91f885b7dde?apiKey=myAPIKey",
			  data: JSON.stringify( { "x" : 2 } ),
			  type: "PUT",
			  contentType: "application/json" } );

	Example setting "y" to 5 in the matching document without affecting other fields (using jQuery): 

	$.ajax( { url: "https://api.mongolab.com/api/1/databases/my-db/collections/my-coll/4e7315a65e4ce91f885b7dde?apiKey=myAPIKey",
			  data: JSON.stringify( { "$set" : { "y" : 5 } } ),
			  type: "PUT",
			  contentType: "application/json" } );
	*/



};


function insertDocument(dbName, collectionName, docId, docJson)
{
	/*
	POST /databases/{database}/collections/{collection}
	Content-Type: application/json
	Body: <JSON data>

	Example (using jQuery):

	$.ajax( { url: "https://api.mongolab.com/api/1/databases/my-db/collections/my-coll?apiKey=myAPIKey",
			  data: JSON.stringify( { "x" : 1 } ),
			  type: "POST",
		  	contentType: "application/json" } );
	*/


};


function deleteDocById(dbName, collectionName, docId)
{
	/*
	DELETE /databases/{database}/collections/{collection}/{_id}

	Example (using cURL): 
	curl -X DELETE 'https://api.mongolab.com/api/1/databases/my-db/collections/my-coll/4e7315a65e4ce91f885b7dde?apiKey=myAPIKey

	Example (using jQuery):

	$.ajax( { url: "https://api.mongolab.com/api/1/databases/my-db/collections/my-coll/4e7315a65e4ce91f885b7dde?apiKey=myAPIKey",
			  type: "DELETE",
			  async: true,
			  timeout: 300000,
			  success: function (data) { },
			  error: function (xhr, status, err) { } } );
	*/


	
};





/******************************************************************************
/* testing code down here
******************************************************************************/



// listCollections makes us a promise to return the list
// we have to use "then" to wait for promise to be fulfilled.
listCollections("wwystest").then(
				function(collections)
				{
					for (var x in collections)
					{
						console.log("collection " + x + ":" + collections[x]);
					}
				},
				function(error)
				{
					// TODO: write me... what should we do here?
					console.log("listCollections AJAX call failed.");
					console.log(error);
				}
);

