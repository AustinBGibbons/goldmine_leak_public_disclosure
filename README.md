# Goldmine

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/austinbgibbons/goldmine_leak_public_disclosure.git.git)

This example app uses the `Transactions` and `Auth` products. 

Scenario: You are addicted to Reddit and find yourself spending way too much time on it. Even worse, you also have the tendency to purchase Reddit Gold every time you come across a super solid post. What better way to reward a stranger on the internet for posting a particularly well-timed gif? Unfortunately, your excessive Reddit Gold spending is straining your budget. Introducing Goldmine! We'll help you kick that habit by tracking your transactions activity to identify Reddit Gold purchases and helping you self-correct that behavior. As an incentive to stop these purchases, we'll withdraw an equal amount of money from your checking account to purchase real gold each time you purchase Reddit Gold. In no time, we'll be helping you on your path to Reddit Gold recovery. 


# Configuration and Setup
Node is needed to run this project.

Save environment variables in .env file (we use the dotenv module for this project).
- `PLAID_CLIENT_ID` - Plaid client id.
- `PLAID_SECRET` - Plaid secret.
- `PLAID_PUBLIC_KEY` - Plaid public key.
- `PLAID_ENV` - Plaid environment for Link initialization.
- `PORT` - 8000
- `TRANSACTION_WEBHOOK_URL` - Your Webhook URL when initializing Link for "Transactions"

```
cd ~/plaid/goldmine
yarn install
```

# Running the app

To run server:
```
yarn start
```

To run webpack:
```
yarn run build
```

To run database (in separate terminal windows): 
```
mongod
```
```
mongo
```

Go to `localhost:8000` and start going through the app!

