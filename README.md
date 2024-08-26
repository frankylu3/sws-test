# Simply Wall St Take Home

## Description

A take home exercise conducted for Simply Wall St. Backend implementation using Typescript and NodeJS to build an API solution to return an array of company entities, along with each company's past share prices.

## Prerequisites

Ensure you have at least node version 18 installed.

## Getting Started
```
# Clone the repository
git clone https://github.com/frankylu3/sws-test.git

# Navigate to the project directory
cd sws-test

# Install dependencies
npm install
```

## Usage

**Start Application**

`npm start`

**Run tests**

`npm test`

## API Documentation

### GET /company/list

**Description**: Retrieve a list of companies including their snowflake score and past prices
**Query Parameters**:

- `exchangeSymbol`: Exchanges to list from, separated by commas
- `minScore`: The minimum overall score for filtering companies
- `maxScore`: The maximum overall score for filtering companies
- `sortBy`: What the returned list should be sorted by
- `sortOrder`: The order to sort by

**Example Request:**

`curl --location 'localhost:3000/company/list?minScore=13&maxScore=18&sortBy=volatility&sortOrder=asc&exchangeSymbol=ASX%2CNYSE'`

**Example Repsonse**:

```json
[
  {
    "id": "46B285BC-B25F-4814-985C-390A4BFA2023",
    "name": "Afterpay",
    "ticker_symbol": "APT",
    "exchange_symbol": "ASX",
    "snowflake": {
      "value": 0,
      "future": 5,
      "past": 0,
      "health": 4,
      "dividend": 0,
      "total": 9
    },
    "last_known_price": 17,
    "prices": [
      {
        "date": "2020-03-25T00:00:00.000Z",
        "price": 15
      },
      {
        "date": "2020-03-26T00:00:00.000Z",
        "price": 17
      }
    ]
  },
  {
    "id": "4BE2C01F-F390-479C-A166-8E0DD73CF7B9",
    "name": "BHP Group",
    "ticker_symbol": "BHP",
    "exchange_symbol": "ASX",
    "snowflake": {
      "value": 1,
      "future": 0,
      "past": 4,
      "health": 3,
      "dividend": 4,
      "total": 12
    },
    "last_known_price": 30.67,
    "prices": [
      {
        "date": "2020-03-25T00:00:00.000Z",
        "price": 31.3
      },
      {
        "date": "2020-03-26T00:00:00.000Z",
        "price": 30.67
      }
    ]
  }
]
```

## Future considerations

- Implement pagination on the endpoint - this would be help improve performance by reducing the amount of data being loaded at one time and limit it to the amount required by the page using the API.
- Write integration test for the endpoint - test the application as a whole end to end.
