# simple-nobel-prize-winners-search

Run NobelPrizeWinnerSearch.html

1. Enter name (partial / case-insensitve) of any nobel prize winner
2. Press Search button

When Search button is pressed, Code fetches two APIs parallely (http://api.nobelprize.org/v1/prize.json AND http://api.nobelprize.org/v1/laureate.json) from the internet.
Then goes through names of the laureates and prints corrosponding information.
