# hebece, a eduVULCAN library for node.js

[![npm version](https://img.shields.io/npm/v/hebece.svg)](https://www.npmjs.com/package/hebece)
[![npm downloads](https://img.shields.io/npm/dm/hebece.svg)](https://www.npmjs.com/package/hebece)

# Features

- [x] Authentication
- [x] Multi student (Untested + half-assed)
- [x] Grades
- [ ] Lessons
- [x] Homework
- [ ] Attendance
- [x] Lucky Number

# Notice
This library is highly experimental, if you want to contribute, you can contribute.

Most of the functions is the raw JSON response from the API, so it can be pretty messy.

Every output from functions has it's typings, so it's easier to develop as you already know the fields.

# Usage

# This will be moved to a GitBook documentation to fit this + typings
  - [new hebece.Keypair()](#new-hebecekeypair)
  - [new hebece.Keystore(path, year)](#new-hebecekeystorepath-year)
  - [new hebece.VulcanJwtRegister(keypair, apiap, tokenIndex)](#new-hebecevulcanjwtregisterkeypair-apiap-tokenindex)
  - [new hebece.VulcanHebeCe(keypair, resturl)](#new-hebecevulcanhebecekeypair-resturl)
  - [After-connect functions](#after-connect-functions)
  - [.getLuckyNumber()](#getluckynumber)
  - [.getHomework(dateFrom, dateTo)](#gethomeworkdatefrom-dateto)
  - [.getGrades()](#getgrades)

# new hebece.Keypair()
Generates a new KeyPair for HebeCE API.

- **Returns: KeyPair** - Result

# new hebece.Keystore(path, year)
Generates a temporary 30mins/1 year JSON database

After the DB expires it will automatically clear itself.

- **Params**
  - **path** - The path of the database
  - **year** - Should the database expire in a year?
- **Throws**: 
  - **Error()** - If something is wrong

# new hebece.VulcanJwtRegister(keypair, apiap, tokenIndex)
Creates a manager for authentication with VULCAN HebeCE API.

- **Params**
	- **keypair** - Your Keypair
	- **apiap** - https://eduvulcan.pl/api/ap output
	- **tokenIndex** - Which token from /api/ap should be used? (Half-assed multistudent implementation)

- **Returns**
  - **.init()** - Function to initialize the manager, send the request to the API

- **Throws**: 
  - **Error()** - If something is wrong 

# new hebece.VulcanHebeCe(keypair, resturl)
Creates the main manager for VULCAN HebeCE API functionality.

- **Params**
	- **keypair** - Your Keypair
	- **restUrl** - The REST URL that the API should use

- **Returns**
  - **.connect()** - Function to connect to the API and send requests.

- **Throws**: 
  - **Error()** - If something is wrong

# After-connect functions

## .getLuckyNumber()
Gets the todays lucky number

- **Returns**
	- **object**
    	- **day** - Day of the lucky number
    	- **number** - The lucky number

- **Throws**
  - **Error()** - If something is wrong.
  
## .getHomework(dateFrom, dateTo) 
Gets your homework from the API.

- **Params**
  - **dateFrom** - The start of the date range
  - **dateTo** - The end of the date range

- **Returns**
  - **object** - Homework object

- **Throws**
  - **Error()** - If something is wrong

## .getGrades()
Gets your grades for the current period from the API.

- **Returns**
  - **object** - Grades object
  
- **Throws**
  - **Error()** - If something is wrong


