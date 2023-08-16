![Build](https://github.com/etherisc/depeg-ui/actions/workflows/build.yml/badge.svg)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![](https://dcbadge.vercel.app/api/server/cVsgakVG4R?style=flat)](https://discord.gg/Qb6ZjgE8)

# Depeg-ui 

This repository contains the source code for web application to the Etherisc [depeg-contracts](https://github.com/etherisc/depeg-contracts).

When starting the application, the webapplication is exposed on port 3000 (or the port specified in the environment variable `PORT`) and path `/`.
Additionally to the frontend, the application also exposes an API on path `/api`.

## API services

The nextjs backend these services:

### Bundles
- `GET /api/bundles/update` - retrieves all bundles and stores them in redis store 
- `GET /api/bundles/clear` - purge all bundles from redis store
- `GET /api/bundles/all` - retrieves all bundles from redis store
- `GET /api/bundles/active` - retrieves all active bundles (which can be used to issue policies) from redis store 

### Prices
- `GET /api/prices/fetch` - retrieves all prices from the blockchain (up to the latest price already stored) and stores them in redis store
- `GET /api/prices/clear` - purge all prices from redis store
- `GET /api/prices/all` - retrieves all prices from redis store. Parameters
    - `after` - only return prices after this timestamp
    - `count` - only return this number of prices
    - `page` - only return prices for this page (page size is `count`)
- `GET /api/prices/latest` - retrieves the latest price from redis store


## Dependencies

### Redis

The application uses redis to store information. The redis modules search and JSON need to enabled. 
The application expects a environment variables called `REDIS_URL` to be set. The application will use the url`'redis://redis:6379'` if no connection is specified in the `REDIS_URL`.

The docker image `redis/redis-stack` can be used to run a redis instance with the required modules enabled.

### Deployed contracts

The application expects that the `depeg-contracts` are deployed to the blockchain. Use the two environment variables `NEXT_PUBLIC_DEPEG_CONTRACT_ADDRESS` and `NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS` to specify the addresses of the depeg product and staking contracts.
The expected version of the contracts can be found in the `package.json` file (look for the package `@etherisc/depeg-contracts`).

### IP Access limit

To limit access to the API to a list of IP addresses, the application expects a environment variable called `API_IP_ALLOWED` to be set. The variable should contain a comma separated list of IP addresses. If the variable is not set, no IP access limit is applied.

## Run in development mode 

The repository includes a vscode _devcontainer_ that installs all the necessary dependencies to run the application.

Create a `.env.local` file in the root directory of the project. Have a look a the `.env.example_local` file for the required environment variables of a setup running again a local ganache chain. The minimum required variables are described below
Then run the application in dev mode with `npm run dev`.


## Configuration

### General config

```
# Blockchain connection configuration
NEXT_PUBLIC_CHAIN_ID=80001
NEXT_PUBLIC_CHAIN_NAME=Polygon Mumbai
NEXT_PUBLIC_CHAIN_RPC_URL=https://polygon-testnet-rpc.allthatnode.com:8545
NEXT_PUBLIC_CHAIN_TOKEN_NAME=TEST-MATIC
NEXT_PUBLIC_CHAIN_TOKEN_SYMBOL=MATIC
NEXT_PUBLIC_CHAIN_TOKEN_DECIMALS=18
NEXT_PUBLIC_CHAIN_TOKEN_BLOCKEXPLORER_URL=https://mumbai.polygonscan.com/
NEXT_PUBLIC_CHAIN_TOKEN_FAUCET_URL=https://faucet.polygon.technology/

# private chain rpc url for backend
#BACKEND_CHAIN_RPC_URL=https://polygon-testnet-rpc.allthatnode.com:8545

# Depeg configuration
NEXT_PUBLIC_DEPEG_CONTRACT_ADDRESS=0x5930513a430E4D0171870aAe73c1e70edcc1917d
NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS=0xe360b8B3abd807e7b02eCaCd8DfA083cFF0f4941
NEXT_PUBLIC_DEPEG_USD1=USDC
NEXT_PUBLIC_DEPEG_USD1_DECIMALS=6
NEXT_PUBLIC_DEPEG_USD2=USDT
NEXT_PUBLIC_DEPEG_USD2_DECIMALS=6
NEXT_PUBLIC_DEPECT_TOKEN_DISPLAY_PRECISION=2
NEXT_PUBLIC_DEPEG_LIFETIME_DAYS_MINIMUM=14
NEXT_PUBLIC_DEPEG_LIFETIME_DAYS_MAXIMUM=180
NEXT_PUBLIC_DEPEG_PROTECTED_AMOUNT_MINIMUM=1000
NEXT_PUBLIC_DEPEG_PROTECTED_AMOUNT_MAXIMUM=50000
NEXT_PUBLIC_DEPEG_COVERAGE_DURATION_DAYS_MINIMUM=7
NEXT_PUBLIC_DEPEG_COVERAGE_DURATION_DAYS_MAXIMUM=180
NEXT_PUBLIC_DEPEG_STAKED_AMOUNT_MINIMUM=25000
NEXT_PUBLIC_DEPEG_STAKED_AMOUNT_MAXIMUM=100000
NEXT_PUBLIC_DEPEG_ANNUAL_PCT_RETURN=5
NEXT_PUBLIC_DEPEG_ANNUAL_PCT_RETURN_MAXIMUM=10
```

#### Override Riskpool capacity limit

Check the riskpool capacity limit and show a warning if the limit is reached (works only if the configured limit is smaller than then limit defined in the smart contract).

- `NEXT_PUBLIC_RISKPOOL_CAPACITY_LIMIT=250000` - configure the riskpool capacity limit to USD2 250000 

#### Override investor whitelist

Check if the investor is whitelisted before investment and show a warning if the investor is not whitelisted.

- `NEXT_PUBLIC_INVESTOR_WHITELIST=0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729` - configure the investor whitelist addresses (comma separated list of addresses)



### Feature flags

#### Gasless transactions 

Enable gasless transactions for the application 

- `NEXT_PUBLIC_FEATURE_GASLESS=true` - enable gasless transactions
- Make sure the [depeg-backend-processor](https://github.com/etherisc/depeg-backend-processor) service is running and connected to the same redis and product. The backend processor is responsible for sending the signed transactions to the blockchain.


#### Price

Show a page that displays the latest price of the protected coin and (if enabled) the price history of the protected coin.

- `NEXT_PUBLIC_FEATURE_PRICE=true` - show latest price of the protected coin
- `NEXT_PUBLIC_FEATURE_PRICE_HISTORY=true` - show price history of the protected coin
- `NEXT_PUBLIC_FEATURE_PRICE_HISTORY_FAKE_DATA=true` - enable loading of fake data for price history (for testing)



### Backend bundle cache

The backend caches the current bundles from the blockchain in a local redis store. 
This information will be updated when a new bundle is created or a policy has been issued. 

The detect outside changes (e.g. when a change to a bundle has been made from the blockchain explorer or a brownie shell) the backend api `/api/bundles/update` should be called on a regular basis (e.g. via a cron job that runs every 10 minutes) to ensure those updates are reflected in the redis store and the ui.


### Backend price cache

The backend caches the prices from the blockchain in a local redis store. 

The detect changes the backend api `/api/prices/fetch` should be called on a regular basis (e.g. via a cron job that runs every minute) to ensure availability of the latest prices in the ui.


### Faucet 

```
NEXT_PUBLIC_SHOW_FAUCET=true
NEXT_FAUCET_MNEMONIC=candy maple cake sugar pudding cream honey rich smooth crumble sweet treat
NEXT_PUBLIC_FAUCET_SYMBOL=USDT
NEXT_PUBLIC_FAUCET_COIN_ADDRESS=0x000Ea55EcF8E37477c2216B4416AB43147F32509
NEXT_FAUCET_SEND_ETHERS=true
NEXT_FAUCET_SEND_TESTCOIN=true
```

### Fake depeg event on test systems

To initiate a fake depeg event these steps are required

1. Set environment variables 
    - `NEXT_PUBLIC_FEATURE_FAKE_DEPEG_ENABLED=true` 
    - `NEXT_FAKE_DEPEG_PRODUCT_OWNER_MNEMONIC=...`
    - `NEXT_FAKE_DEPEG_PRODUCT_OWNER_HD_WALLET_INDEX=x` - (optional) if the product owner is derived from a hd wallet 
1. Use a PriceDataProvider that is fed through the `depeg-monitor` with fake prices
1. Trigger a depeg event by calling an HTTP PUT to `/v1/feeder/set_state/triggered` on the depeg monitor
1. Wait a bit for the price feed to go into triggered state (how long to wait depends in the price feed config)
1. Trigger a depeg event by calling an HTTP PUT to `/v1/feeder/set_state/depegged` on the depeg monitor
1. Wait a bit for the price feed to go into depegged state (how long to wait depends on price feed config)
1. Confirm depeg by calling the api `/api/fake-depeg/confirm` which will store the latest blocknumber as the time of depeg (technically not correct, but good enough for testing)
1. Execute some claims through the UI
1. Call the api `/api/fake-depeg/process` to process these claims and issue immediate payout 
1. If you want to reset the system to be able to issue new policies, call an HTTP PUT to `/v1/product/reactivate` and `/v1/feeder/set_state/stable` on the monitor to reset the price feed. 
1. Finally reset fake data in the api by calling `/api/fake-depeg/reset`


## Run docker image locally with mumbai instance configuration

```
docker build -t depeg-ui --build-arg INSTANCE=mumbai .
docker run --rm -p 3002:3000 depeg-ui
```

open browser at http://localhost:3002


## Deployment

### Docker

The application can be run in a docker container. The docker image can be build via the provided `Dockerfile`. We do not currently provide a prebuilt docker image as the image includes static instance information that needs to be configured at build time.

The build process requires the following arguments:

- `INSTANCE` - the name of the instance to build the image for. The instance name is used to load the correct configuration from the `.env.INSTANCE` file in the root diretory of the project (see `.env.mumbai` as an example). 

### Dokku Deployment

We use [dokku](https://dokku.com/) for deployment. 

With the current setup (dokku repo is added as remote repo called `dokku` to the local git), deployment is triggered by running the following command in the root directory of the project:

```
npm version <major|minor|patch> 
git push && git push --tags
git push <dokku-remote-repo> <branch-to-deploy>:main
```

#### Initial instance setup

Replace application name (`goerli-setup`) with whatever fits your need. DNS is expected to be prepared in advance.

```
# create dokku application 
dokku apps:create goerli-depeg

# add new domain and remove default domain
dokku domains:add goerli-depeg depeg.goerli.etherisc.com
dokku domains:remove goerli-depeg goerli-depeg.depeg-test.etherisc.com

# configure dokku docker build to load correct instance environment during build
dokku docker-options:add goerli-depeg build --build-arg INSTANCE=goerli

# set correct proxy ports for http and https
dokku proxy:ports-add goerli-depeg https:443:3000
dokku proxy:ports-add goerli-depeg http:80:3000
dokku proxy:ports-remove goerli-depeg http:80:5000

# create redis service
dokku redis:create depeg-test-goerli-redis -i redis/redis-stack-server -I 7.2.0-v0

# now you need to manually enable redissearch and redisjson modules in the redis config (replace 'depeg-mumbai-redis' below with correct service name)
vi /var/lib/dokku/services/redis/depeg-mumbai-redis/config/redis.conf
# scroll down to the section 'MODULES' and paste the following two lines (remove the # in front of the lines)
# loadmodule /opt/redis-stack/lib/redisearch.so
# loadmodule /opt/redis-stack/lib/rejson.so

# restart redis service
dokku redis:restart depeg-mumbai-redis
# link the redis service to the app
dokku redis:link depeg-test-goerli-redis goerli-depeg

# now push deployment via git 
# 1. add new git remote 'git remote add dokku-goerli dokku@<host>:goerli-depeg'
# 2. 'git push dokku-goerli develop:main'

# enable let's encrypt for https certificates
dokku letsencrypt:enable goerli-depeg

# configure backend chain rpc url
dokku config:set goerli-depeg BACKEND_CHAIN_RPC_URL=<chain rpc url>

# initial update of the bundle cache (probably empty)
curl https://<application-url>/api/bundles/update
# initial fetch of the price data (must be done twice the first time - if index is not initialized yet)
curl https://<application-url>/api/prices/fetch

# app should be ready now - open in browser

# do not forget to configure a cronjob to regularly update the bundles. e.g.
# '*/5 * * * * curl https://depeg.goerli.etherisc.com/api/bundles/update'
# '* * * * * curl https://depeg.goerli.etherisc.com/api/prices/fetch'
```

#### Dokku redis debug connection

Example using service _depeg-mumbai-redis_:

1. Expose redis port on dokku `dokku redis:expose depeg-mumbai-redis`
1. Find the exposed port in the output above or via `dokku redis:info depeg-mumbai-redis`
1. Open ssh tunnel with dokku redis port forward `ssh -L 6479:localhost:15956 user@host`
1. Now connect with redis client of choice (e.g. RedisInsight) using `localhost:6479` as host and the password mentioned in redis info
1. When finished, close the ssh tunnel by logging out of the ssh shell and unexpose the redis port `dokku redis:unexpose depeg-mumbai-redis`

#### Dokku documentaton links: 

- https://dokku.com/docs/deployment/application-deployment/
- https://dokku.com/docs/advanced-usage/docker-options/
- https://dokku.com/docs/configuration/domains/
- https://github.com/dokku/dokku-redis
- https://hub.docker.com/r/redis/redis-stack

