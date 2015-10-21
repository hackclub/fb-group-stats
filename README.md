# fb-group-stats

Make process calls the parse deploy tool, so it needs the [parse deploy tool](https://parse.com/apps/quickstart#cloud_code/) to be installed.

Run `make build` to compile

`make deploy` to deploy

Before building, make sure the following environment variables:

- `FBTOKEN` - [facebook access token](https://developers.facebook.com/docs/facebook-login/access-tokens)
- `GROUPID` - [facebook group ID](http://stackoverflow.com/questions/8957340/how-do-i-find-my-facebook-group-id)

After deploying, make sure to set up the `grabFacebookPosts` [background job](http://blog.parse.com/announcements/introducing-background-jobs/) to grab all the posts from your facebook group as frequently as you like.

##Facebook Access Tokens Expire
Use the [graph API explorer](https://developers.facebook.com/tools/explorer/) to get a temporary access token for testing. This token will expire in one hour.


Once you're ready to make a more permanent access token, [make a facebook app](https://developers.facebook.com/docs/apps/register), set the permissions you need, and click debug on the [app's access token](https://developers.facebook.com/tools/accesstoken/) so you can get to the page that allows you to `Extend Access Token` 

##Check group activity

####Easy Range - (Days Back,Days Forward)
Example: If I want to look back to last month, daysBack = 60 and daysForward = 30. If I want to look at this week, daysBack = 7 and daysForward = 7.

 `curl -X POST \
  -H "X-Parse-Application-Id: _PARSEAPPID_" \
  -H "X-Parse-REST-API-Key: _PARSEAPIKEY_" \
  -H "Content-Type: application/json" \
  -d '{"daysBack": _daysBack_, "daysForward": _daysForwardFromThere_}' \
  https://api.parse.com/1/functions/countItems`
  
####Exact Range - (Start Date,End Date)
Specify the specific range to get a count. startDate and endDate are both [Javascript Date Objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date).

 curl -X POST \
  -H "X-Parse-Application-Id: _PARSEAPPID_" \
  -H "X-Parse-REST-API-Key: _PARSEAPIKEY_" \
  -H "Content-Type: application/json" \
  -d '{"beginDate": _startDate_, "endDate": _endDate_}' \
  https://api.parse.com/1/functions/countItemsWithDateRanges
  
You can find your _PARSEAPPID_ and _PARSEAPIKEY_ in your Parse dashboard for your App.


  



