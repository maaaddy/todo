README
This README is meant to show a user how to get the to-do web application running. 
Currently, to-do is not up on a server, a user would have to test it locally.

The user will need to get both the frontend and backend going in order to test note taking functionality.

**------Instructions to get frontend running:**

  * Clone repository
  * Navigate to the Project Directory, then to frontend
  * Install Dependencies
    Run the following command to install all required dependencies:
    - npm install
  * Run the project by navigating to the project directory and running: 
    - npm start
    - For this step, make sure you're in the frontend folder
  * View the project (without db) on localhost:3000

**------Instructions to get backend running:**

  * Begin w/ instructions from above, then do this part
  * You will need a cluster from MongoDB. It's free on their website.
    - Go to their website, log in, create a cluster.
    - On your cluster, click Connect -> Drivers -> copy your connection string.
  * In the project directory, navigate to the api folder
  * Create a file in the api folder called '.env'
    - This file should contain two lines:
      * MONGO_URL="{connection string}"
      * CLIENT_URL="http://localhost:5000/"
    - Replace {connection string} with the connection string you copied from your cluster.
  * Navigate to the api directory and use command
    -node server.js

**------Enjoy!------**
