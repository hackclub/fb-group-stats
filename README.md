# fb-group-stats

Make process calls the parse deploy tool, so it needs the [parse deploy tool](https://parse.com/apps/quickstart#cloud_code/) to be installed.

Run `make build` to compile

`make deploy` to deploy

Before building, make sure the following environment variables:

- `FBTOKEN` - facebook access token
- `GROUPID` - facebook group ID

After deploying, make sure to set up the `grab all posts` [background job](http://blog.parse.com/announcements/introducing-background-jobs/) to grab all the posts from your facebook group every day.
