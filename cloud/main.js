var moment = require('moment');
var parseClassName = "PostTests7"

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

var saveListOfPosts = function(list, callback) {
    // save all the newly created objects
    Parse.Object.saveAll(list, {
        success: function(objs) {
            // objects have been saved...
            removeDuplicateItems(function(response, error) {
				if (error == null) {
					callback(objs, null)
				} else {
					callback(null, error)
				}
			})

        },
        error: function(error) { 
            // an error occurred...
            callback(null, error)
        }
    });
}

var makeListOfPostsAndSave = function(posts, callback) {
	var Post = Parse.Object.extend(parseClassName);
	//callback(posts.length, null)
    // this will store the rows for use with Parse.Object.saveAll
    var postArray = [];

    // create a few objects, with a random state 0 or 1.
    for (var i = 1; i <= posts.length; i++) { 
      var post = new Post();
		if (typeof posts[i] === "undefined") {
		  //log("something is undefined");
		} else {
	      post.set("json",posts[i])
	      post.set("updated_time", moment(posts[i]["updated_time"]).toDate())
	      post.set("positionY",i)
	      post.set("state",Math.floor(Math.random() * 2))
	      post.set("fb_id", posts[i]["id"])
	      postArray.push(post);			
		}

    }

    saveListOfPosts(postArray, function(success, error) {
    	if (error == null) {
    		callback(success, null)    		
    	} else {
    		callback(null, error)
    	}

    }) 
}

Parse.Cloud.define("requestMe", function(request, response) {
	var token = "${FBTOKEN}"
	var groupID = "${GROUPID}"
	Parse.Cloud.httpRequest({
	  url: 'https://graph.facebook.com/v2.4/' + groupID + '/feed?limit=500&access_token=' + token
	}).then(function(httpResponse) {


	  // success
	  var json_result = JSON.parse(httpResponse.text)
	  var postArray = json_result.data

	  makeListOfPostsAndSave(postArray, function(success, error) {
	  	if (error == null) {
	  		response.success(success)	  		
	  	} else {
	  		response.success(error)
	  	}
	  })


	  //response.success(json_result.data)

	  // var first_item = json_result.data[0]
	  // response.success(json_result.data.length)
	},function(httpResponse) {
	  // error
	  response.error('Request failed with response code ' + httpResponse.status);
	});
})

var removeDuplicateItems = function (callback) {
  Parse.Cloud.useMasterKey();
  var _ = require("underscore");

  var hashTable = {};

  function hashKeyForTestItem(testItem) {
    var fields = ["fb_id"];
    var hashKey = "";
    _.each(fields, function (field) {
        hashKey += testItem.get(field) + "/" ;
    });
    return hashKey;
  }

  var testItemsQuery = new Parse.Query(parseClassName);
  testItemsQuery.each(function (testItem) {
    var key = hashKeyForTestItem(testItem);

    if (key in hashTable) { // this item was seen before, so destroy this
        return testItem.destroy();
    } else { // it is not in the hashTable, so keep it
        hashTable[key] = 1;
    }

  }).then(function() {
    callback("Migration completed successfully.", null)
  }, function(error) {
    callback(null, error)
  });	
}

Parse.Cloud.define("removeDuplicateItems", function(request, status) {
	removeDuplicateItems(function(response, error) {
		if (error == null) {
			status.success(response)
		} else {
			status.error(error)
		}
	})
});

var countItemsFromRange = function (startDate, endDate, callback) {
	Parse.Cloud.useMasterKey();
	var Post = Parse.Object.extend(parseClassName);
	var query = new Parse.Query(Post);
	//query.limit(500)
	query.greaterThanOrEqualTo("updated_time", startDate);
	query.lessThanOrEqualTo("updated_time", endDate);
	query.count({
	  success: function(count) {
	    // The count request succeeded. Show the count
	    callback(count, null);
	  },
	  error: function(error) {
	    // The request failed
	    callback(null, error)
	  }
	});
}

Parse.Cloud.define("countItems", function(request, status) {
	var daysBack = request.params.daysBack
	var daysForward = request.params.daysForward
	var endDate = new Date()
	endDate.setDate(endDate.getDate()-daysBack+daysForward);
	var beginDate = new Date();
 	beginDate.setDate(beginDate.getDate()-daysBack);

 	countItemsFromRange(beginDate, endDate, function(response, error) {
 		if (error == null) {
 			status.success(response)
 		} else {
 			status.error(error)
 		}
 	})
});

Parse.Cloud.define("countItemsWithDateRanges", function(request, status) {
	countItemsFromRange(request.params.beginDate, request.params.endDate, function(response, error) {
 		if (error == null) {
 			status.success(response)
 		} else {
 			status.error(error)
 		}
 	})
})

Parse.Cloud.define("findMostRecentPost", function(request, response) {

})


