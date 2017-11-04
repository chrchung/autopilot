# matchmakers2

Dependencies:
- install the latest version of node.js 

Building & running the project:
- clone the github repo
- cd into the root of the hierarchy
- run "sudo npm install" in Terminal
- run "bower install" in Terminal
- launch the application by running "node server.js" in Terminal 

Brief description of code structure:
- the game logic is in game.js

- getNextAll(direction) enables players to scroll through elements in each model. direction argument can either by '+' to scroll forward, or '-' to scroll backward
- toggleModel(modelNum) enables players to add/remove elements from the tuple they are building
- toggleModelReorder(modelNum) enables players check/uncheck the current element being displayed in model modelNum. The elements in each model and the tuples in the suggested list of tuples are sorted based on their similarity to the checked elements 
- getAlpha() determines a property's background opacity. Opacity is calculated as follows:
1. determine the # of occurrences for each property in the current tuple
2. sort each property by # of occurrences in descending order
3. property opacity = total number of unique properties in current tuple - property's position when sorted by # of occurrences / total number of unique properties in the current tuple
