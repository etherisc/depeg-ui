# Depeg-ui 

This repository contains the source code for web application to the Etherisc [depeg-contracts](https://github.com/etherisc/depeg-contracts).

## Development 

The repository includes a vscode _devcontainer_ that installs all the necessary dependencies to run the application.

Create a `.env.local` file in the root directory of the project. Have a look a the `.env.example_local` file for the required environment variables of a setup running again a local ganache chain. 

The minimum required variables are 
- `NEXT_PUBLIC_DEPEG_CONTRACT_ADDRESS` the address of the deployed depeg product contract
- `NEXT_PUBLIC_DEPEG_USD1` the name of the USD1 token
- `NEXT_PUBLIC_DEPEG_USD2` the name of the USD2 token
- `NEXT_PUBLIC_DEPEG_SUMINSURED_MINIMUM` the minimum allowed sum insured
- `NEXT_PUBLIC_DEPEG_SUMINSURED_MAXIMUM` the maximum allowed sum insured
- `NEXT_PUBLIC_DEPEG_COVERAGE_DURATION_DAYS_MINIMUM` the minimum allowed coverage duration in days
- `NEXT_PUBLIC_DEPEG_COVERAGE_DURATION_DAYS_MAXIMUM` the maximum allowed coverage duration in days
- `NEXT_PUBLIC_DEPEG_INVESTED_AMOUNT_MINIMUM` the minimum allowed invested amount
- `NEXT_PUBLIC_DEPEG_INVESTED_AMOUNT_MAXIMUM` the maximum allowed invested amount
- `NEXT_PUBLIC_DEPEG_ANNUAL_PCT_RETURN` the annual percentage return of the investment
- `NEXT_PUBLIC_DEPEG_ANNUAL_PCT_RETURN_MAXIMUM` the maximum allowed annual percentage return of the investment

Then run the application in dev mode with `npm run dev`.


## Deployment

TODO:

