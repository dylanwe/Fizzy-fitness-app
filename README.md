# Fizzy - An opens-source fitness app

![Showcase](/client/img/fizzy-thumbnail.png)

Fizzy is an open-source fitness app that helps you log your workouts and keep track of you workouts.

## [Demo](https://youtu.be/RcGxFgKqzA4)

## Features
- Log workouts live
- Account creation
- Workout template creation
- See progression in charts
- Check past completed workouts
- Small [API](https://github.com/dylanwe/fizzy-fitness-app/blob/main/controllers/api/README.md) for developers so they can pull their own data.

## To start
1. build the database from the `db` folder `database.sql`
2. run `npm i`
3. run `npm run build`
4. create a `.env` file in the root folder
5. Fill it in:

```
PORT=3000

DB_HOST='localhost'
DB_USER=''
DB_PASSWORD=''
DB_NAME='fizzy'

SESSION_SECRET=secret
```

To start developing run `npm run dev`.

![Showcase](/client/img/fizzy-showcase.png)
