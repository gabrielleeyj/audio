# audio

To run the application.
You will need to create a `.env` in the `./backend` with the following credentials in place.

```env
JWT_SECRET=<anythingyouwant> // required
AWS_ACCESS_KEY_ID=<your s3 bucket id> // optional
AWS_ACCESS_SECRET_KEY=<your own s3 bucket> // optional
```

If you choose not to add a AWS S3 Key, its will push the audio files to the local storage via the path `/audio/${userid}/${filename}`

Once you've set your .env then you can run `docker compose up --build`. This should build both the API and UI containers.

Open your browser and start testing the UI `https://localhost`


There are 2 accounts to test functionality.

1. Admin user
    - username: `admin`
    - password: `adminPass`

2. Normal user
    - username: `user`
    - password: `userPass`

