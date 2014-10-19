var AppRouter = Backbone.Router.extend({
		routes: {

				"posts/:id": "getPost",
				// <a href="http://example.com/#/posts/121">Example</a>

				"download/*path": "downloadFile",
				// <a href="http://example.com/#/download/user/images/hey.gif">Download</a>

				":route/:action": "loadView",
				// <a href="http://example.com/#/dashboard/graph">Load Route/Action View</a>

		},
});
// Instantiate the router
var app_router = new AppRouter;
app_router.on('route:getPost', function( id ){ 
		alert(id); // 121 
});
app_router.on('route:downloadFile', function( path ){ 
		alert(path); // user/images/hey.gif 
});
app_router.on('route:loadView', function( route, action ){ 
		alert(route + "_" + action); // dashboard_graph 
});

// Start Backbone history a necessary step for bookmarkable URL's
Backbone.history.start();
