### Point of Sale Tutorial
The distributed and increasingly connected nature of data management allows for all sorts of workflows that were not possible before. Combined with the increasing popularity of mobile payment processors (Apply Pay, Bitcoin etc), we are seeing lots of POS type apps that enable small vendors to sell their products.  
In this tutorial, we'll build a basic point of sale system. We'll create an HTML5 app using Ionic and Apache Cordova. This app will use pouchDB to seamlessly synch with a Cloudant backend.  
Cloudant is going to allow us to seamlessly synch our data with our app, enabling users to work offline or when they have spotty connections. We'll also use Cloudant to aggregate transaction data.

#### Step 1: Set up Cloudant
##### Get a Cloudant Account
If you don't yet have one, you'll need a Cloudant account. It's free to use, so head on over to https://cloudant.com/sign-up/ and get one now. 
##### Replicate the product database
You need a product database, so we will replicate an existing database to your Cloudant account.
1. Select 'Replication' from the left menu
2. Select 'New Replication'
3. For 'Source Database', select the 'Remote Database' tab and enter the following: https://ryanporter.cloudant.com/pos-products
4. For 'Target Database', select 'New Database', 'Local' and enter 'pos-products' as the database name
In short order, you will have replicated the necessary database down to your Cloudant account.
##### Assign the appropriate permissions to your products database
Now that you have your own copy of the pos-products database, you need to create the appropriate permissions so your client app can replicate data from Cloudant. You will be allowing anyone to connect to your account and read data from your 'pos-products' database. While it is not usually a good idea to open your databases to the world, in this case we want to explore some of the different ways we can get data out of Cloudant. 
1. Select the 'pos-products' database from your Cloudant dashboard
2. Click the 'Permissions' tab
3. Give 'Other users' the _reader permission
##### Create the transactions database
This database will store the transactions that your point of sale terminals process. We will be synching data from your client app to your CLoudant account. However, there is nothing stopping you from synching multiple client apps to one Cloudant account, which would allow you to aggregate transaction data for analysis.
1. Select 'Databases' from the left hand menu
2. Select 'Create Database' from the top right
3. Enter 'pos-transactions' as the DB name
##### Assign the appropriate permissions to your transactions database
We will use the api key system to access our transactions database from the client app.
1. Select the 'pos-transactions' database from your Cloudant dashboard
2. Click the 'Permissions' tab
3. Click the 'Generate API Key' button. You will see a Key/Password pair generated for you, as well as a corresponding user. Copy these values somewhere, you will need them shortly.
4. Give this newly created user the _reader and _writer permissions.

#### Step 2: Check out the app code
1. Fire up terminal and navigate to an appropriate directory
2. Clone the mobile app code:  
`$ git clone https://github.com/ryan-porter/point-of-sale.git`

#### Step 3: Set up Ionic
Ionic is a UI framework for creating HTML5 apps. Under the covers, it uses Apache Cordova to turn your HTML5 code into a cross platform app. Pretty fancy! Visit the [website](http://ionicframework.com/getting-started/) for more info, or just follow the steps below.
1. Install [node.js](https://nodejs.org/en/) if you do not already have it.
2. Install the latest Cordova and Ionic command line tools:  
`$ npm install -g cordova ionic`
3. Navigate to the directory you checkout out your app code in and initialize the project:  
`$ ionic start point-of-sale`

#### Step 4: Replication: Connect your app with Cloudant
One of the goals of this demo is to highlight how different data synchronization methods can be used in every day applications. This app will demonstrate:
1. Repliction of product data from Cloudant to the client app
- change the `cloudantAccount` variable on line 29 of /www/js/app.js to your Cloudant acccount name
2. Local storage of items in the user's cart within the client app
3. Repliction of transaction data from the client app to Cloudant. This piece of the puzzle must be able to be used offline. For instance, what if a user doesn't have an internet connection, and they need to sell products with cash?  
- change the `apiKey` and `apiPass` variables on lines 30-31 of /www/js/app.js to be the values you recorded earlier while setting up your pos-transactions db

#### Step 5: Build and deploy your app
It's time to see the app in action. You can build and deploy the app to a mobile device or to your browser window.  

To emulate in an iOS simulator:
1. `$ ionic build ios`
2. `$ ionic emulate ios`

To emulate in an android simulator:
1. `$ ionic build android`
2. `$ ionic emulate android`

To deploy to a connected iOS device:
1. `$ ionic build ios` 
2. open XCode and open the iOS project in the /platforms/ios/ folder
3. run the project as you would any other iOS app 

To deploy to a connected android device:
1. `$ ionic run android`

To see the resulting app in your browser
1. Run this command from your projects root folder: `$ ionic serve`
2. navigate to [http://localhost:8100](http://localhost:8100)

#### Conclusion
As you use the app, you'll notice that the transactions page will show a yellow indicator if a transaction has not yet synched to Cloudant, and a green checkmark after it synchs. Play around with it by turning your wifi on/off to see how if would act in a realistic scenario.  
You can see how easy it is to create a cross-platform mobile app that seamlessly synchs data between server and app, while tolerating intermittent connectivity.