## Point of Sale Tutorial
The distributed and increasingly connected nature of data management has enabled all sorts of workflows that were not possible until recently. Combined with the increasing popularity of mobile payment processors (Apply Pay, Bitcoin etc), we are seeing lots of POS type apps that enable small vendors to sell their wares.
In this tutorial, we'll build a basic point of sale system. We'll create an HTML5 app using Ionic and Apache Cordova. This app will use pouchDB to seamlessly synch with a Cloudant backend.
Cloudant is going to allow us to seamlessly synch our data with our app, enabling users to work offline or when they have spotty connections. We'll also use Cloudant to aggregate transaction history and synch that data back to the client app.'

### Step 1: Set up Cloudant
#### Get a Cloudant Account
If you don't yet have one, you'll need a Cloudant account to do this exercise. It's free, so head on over to https://cloudant.com/sign-up/ and get one now. 
#### Replicate the necessary databases
You need a product database, so we will replicate an existing database to your Cloudant account.
1. Select 'Replication' from the left menu
2. Select 'New Replication'
3. For 'Source Database', select the 'Remote Database' tab and enter the following: https://ryanporter.cloudant.com/pos-products
4. For 'Target Database', select 'New Database', 'Local' and enter 'pos-products' as the database name
In short order, you will have replicated the necessary database down to your Cloudant account.

### Step 2: Setup Ionic
#### Install Ionic
Ionic is a UI framework for creating HTML5 apps. Under the covers, it uses Apache Cordova to turn your HTML5 code into a cross platform app. Pretty fancy! Visit the [website](http://ionicframework.com/getting-started/) for more info, or just follow the steps below.
1. Install [node.js](https://nodejs.org/en/) if you do not already have it.
2. Install the latest Cordova and Ionic command line tools:
`$ npm install -g cordova ionic`
3. Start a new project
`$ ionic start myApp tabs`

### Step 3: add pouchDB to your app
In order to facilitate data synchronization between your Cloudant account and the app, we will add pouchDB as a local datastore in the app. pouchDB is a local storage database based off couchDB. Cloudant was also created from couchDB, and as a result, Cloudant and pouchDB share the same replication protocols, making them an easy way to keep data in synch between your server and mobile devices.
1. download pouchDB.js
2. add pouchDB.js to your app
3. add replication between Cloudant and the app

### Step 4: Replication: Connect your app with Cloudant

### Step 5: Build and deploy your app

