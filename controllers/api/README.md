# API DOCS
This API is used to get information from your own completed workouts. To get a **API key** you need to login in the fitness app and go to settings. In the settings you will need to generate a new API key and once that is done you'll have your key.

| Path                             | Result                                       |
|----------------------------------|----------------------------------------------|
| GET /api/`APIKEY`/history        | Get all workouts you've completed            |
| GET /api/`APIKEY`/history/`id`   | Get a workout from history with the given id |
| GET /api/`APIKEY`/stat           | Get all your exercise statistics             |
| GET /GET /api/`APIKEY`/stat/`id` | Get statistic of exercise with given id      |