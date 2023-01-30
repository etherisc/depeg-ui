![Build](https://github.com/etherisc/depeg-ui/actions/workflows/build.yml/badge.svg)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![](https://dcbadge.vercel.app/api/server/cVsgakVG4R?style=flat)](https://discord.gg/Qb6ZjgE8)

# Depeg-ui 

This repository contains the source code for web application to the Etherisc [depeg-contracts](https://github.com/etherisc/depeg-contracts).

## Run in development mode 

The repository includes a vscode _devcontainer_ that installs all the necessary dependencies to run the application.

Create a `.env.local` file in the root directory of the project. Have a look a the `.env.example_local` file for the required environment variables of a setup running again a local ganache chain. The minimum required variables are described below
Then run the application in dev mode with `npm run dev`.

## Configuration

## General config

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
NEXT_PUBLIC_DEPEG_SUMINSURED_MINIMUM=1000000000
NEXT_PUBLIC_DEPEG_SUMINSURED_MAXIMUM=50000000000
NEXT_PUBLIC_DEPEG_COVERAGE_DURATION_DAYS_MINIMUM=7
NEXT_PUBLIC_DEPEG_COVERAGE_DURATION_DAYS_MAXIMUM=180
NEXT_PUBLIC_DEPEG_INVESTED_AMOUNT_MINIMUM=25000000000
NEXT_PUBLIC_DEPEG_INVESTED_AMOUNT_MAXIMUM=100000000000
NEXT_PUBLIC_DEPEG_ANNUAL_PCT_RETURN=5
NEXT_PUBLIC_DEPEG_ANNUAL_PCT_RETURN_MAXIMUM=10
```

### Feature flags

- `NEXT_PUBLIC_FEATURE_PRICE` - show latest price of the protected coin
- `NEXT_PUBLIC_FEATURE_PRICE_HISTORY` - show price history of the protected coin
- `NEXT_PUBLIC_FEATURE_PRICE_HISTORY_FAKE_DATA` - enable loading of fake data for price history


### Faucet 

```
NEXT_PUBLIC_SHOW_FAUCET=true
NEXT_FAUCET_MNEMONIC=candy maple cake sugar pudding cream honey rich smooth crumble sweet treat
NEXT_PUBLIC_FAUCET_SYMBOL=USDT
NEXT_PUBLIC_FAUCET_COIN_ADDRESS=0x000Ea55EcF8E37477c2216B4416AB43147F32509
NEXT_FAUCET_SEND_ETHERS=true
NEXT_FAUCET_SEND_TESTCOIN=true
```

## Run docker image locally with mumbai instance configuration

```
docker build -t depeg-ui --build-arg INSTANCE=mumbai .
docker run --rm -p 3002:3000 depeg-ui
```

open browser at http://localhost:3002


## Deployment

```
git push dokku develop:main
```
