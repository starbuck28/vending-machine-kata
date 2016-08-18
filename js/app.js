// JavaScript Document

//Amount of change currently in machine
var currentChange = 0;

var strCurrent;
var costItem;
var foodObj;
var exactChange = false;
var isCoin = [];

//Screen text options
var screenDefault = "<p>Insert Coins</p><p>$0.00</p>";
var screenThanks = "<p>THANK YOU</p>";
var cannotAccept = "<p>Cannot accept coin.</p>";
var screenExact = "<p>Exact change only</p>";
var screenSoldOut = "<p>SOLD OUT</p>";
//var viewCurrentTotal = "<p>Insert Coins</p><p>$" + strCurrent + "</p>";


//Array of coin objects w/ properties- belongs to vending machine
var coins = [{
  name: "nickel",
  weight: 5.0,
  diameter: 0.84,
  value: 0.05
}, {
  name: "dime",
  weight: 2.27,
  diameter: 0.7,
  value: 0.1
}, {
  name: "quarter",
  weight: 5.8,
  diameter: 0.96,
  value: 0.25
}];

//Products for sale in vending machine w/ costs and inventory
var foods = [ {
  name: "cola",
  cost: "1.00",
  inventory: 10
},
{
  name: "chips",
  cost: "0.50",
  inventory: 10
},
{
  name: "candy",
  cost: "0.65",
  inventory: 10
}
];

//Updates screen message based on text argument
function screenMessage(text) {
  $(".screen").html(text);
}

//Resets isCoin array and converts weight of coin to number
function convertWeight(value) {
    isCoin = [];
    var number = parseFloat(value);
    return number;
}


function searchForValue(weight) {
  for (var i =0; i < coins.length; i++) {
    for (var prop in coins[i]) {
    if (coins[i][prop] === weight) {
      //Add coin obj value to isCoin array
      isCoin.push(weight);
      //Assign object's value to inserted coin variable
      var insertedCoin = coins[i].value;
      updateCurrentChange(insertedCoin);
  
      var viewCurrentTotal = "<p>Insert Coins</p><p>$" + strCurrent + "</p>";
      //Append total to screen
      screenMessage(viewCurrentTotal);
      //add inserted coin to new isCoin array
      console.log(insertedCoin);
      console.log(currentChange);
      console.log(strCurrent);
    }  
   }
  }
}


//Tracks current value of change in machine and converts to string
function updateCurrentChange(inserted) {
  //Add val of inserted coin to total amt inserted in machine
      currentChange += inserted;
      //Convert total to string w/ 2 decimals
      strCurrent = currentChange.toFixed(2);
}

//Checks to see if coin can be accepted, if not, updates screen
function coinNotAccepted(arrVal) {
   if (arrVal === undefined) {
    console.log("coin not accepted");
    //Update screen
    screenMessage(cannotAccept);
    //Alert user to remove coin
    getCoins();
  }
}

//Checks to see if food exists, if does, assigns values to variables
function foodExists(valueOfItem) {
  for(var i = 0; i < foods.length; i++) {
    
    var foodName = foods[i].name;
    //var possFoodObj = foods[i];    
      //Checks to see if selection's value exists in foods array
      if (valueOfItem === foodName) {
        console.log("exact match!");
        //Assigns cost 
        costItem = foods[i].cost;
        //Assigns matching obj to variable
        foodObj = foods[i];
        console.log(costItem);
    }
  }  
}


//Resets change amout in machine to 0
function resetChange() {
  return currentChange = 0;
}

function updateTotal() {
  var returnChange = currentChange - costItem;
           strCurrent = returnChange.toFixed(2);
           console.log("current change:" + strCurrent);
}

//Tells user amount of change receiving
function tellUserChange(currentStr) {
  $(".screen").append('<p class="change_message">Change: $' + currentStr + '</p>');
}

//Actions for machine to take if return change button pressed
function changeReturn() {
    //Update screen: THANKS
    screenMessage(screenThanks);
    //Tell user amount of change returned
    tellUserChange(strCurrent);   
   //Send change to coin return
    getCoins();
    //Reset amount in machine
    resetChange();
 
}

//Actions for machine to take if item is sold
function itemSold() {
   //Update screen: THANKS
  screenMessage(screenThanks);
  //Send item to collect area
  collectItem();
 //Update inventory
  updateInventory();
}

//Actions for machine to take if change inserted is less than item cost
function itemCostsLess(costOfItem) {
    //If exact change required
     if (exactChange) {
      //Update screen: exact change
       screenMessage(screenExact);
     } else if (foodObj.inventory === 0) {
        //Update screen: SOLD OUT
        screenMessage(screenSoldOut);
  } else {
    var screenCostItem = '<p>PRICE</p><p>$' + costItem + '</p>';
    //Update screen: PRICE
   screenMessage(screenCostItem);
  }
}

//Actions for machine to take if amount of change inserted = item cost
function itemCostsSame(costOfItem) {
    //If item out of stock
    if (foodObj.inventory === 0) {
      //Update screen: SOLD OUT
      screenMessage(screenSoldOut);
    } else {
      itemSold();
      //Update total change in machine
      resetChange();
      }
    }

//Actions machine takes if amount of change entered is more than item cost
function itemCostsMore(costOfItem) {
        //If exact change required
        if (exactChange) {
          //Update screen: Exact change
         screenMessage(screenExact);
          //If item sold out
        } else if (foodObj.inventory === 0) { 
          //Update screen: SOLD OUT
          screenMessage(screenSoldOut);
          } else {
           itemSold();
           //Update total
           updateTotal();
          //Return change to user
          changeReturn();   
         }
      
}

//Subtracts item from inventory
function updateInventory() {
  return foodObj.inventory -= 1;
}

//Alerts user to get coins from coin return
function getCoins() {
   $(".coin_return").html('<p class="cc">Collect Change</p>');
}


//Function to activate collection of vending machine item
function collectItem() {
   //Send item to collect area
    $(".collect").html("<h3>Click here to collect item</h3>");
      //When collect area clicked
      $(".collect").click(function() {
        //Reset collect area
        $(".collect").html("");
        //Reset screen
        screenMessage(screenDefault);
  });
}
                          
//Keep track of money inserted
  //When coin button clicked
  $(".add_coin").click(function() {
    //Convert button value aka weight into number
    var val = $(this).val();
    var numWeight = convertWeight(val);
    //Reset screen
    screenMessage(screenDefault);
  //Search coins array for value
    searchForValue(numWeight);
  //If a number was not pushed to array aka coin doesn't exist for machine
  coinNotAccepted(isCoin[0]); 
  console.log(isCoin);
});
 

  //Select food item
  $(".selection").click(function() {
   //Assign button's value to valItem
    var valItem = $(this).val();
    console.log(valItem);
     //Check to see if food exists in machine
     foodExists(valItem); 
     //If cost of item is less than amount inserted in machine   
     if (strCurrent < costItem) { itemCostsLess(costItem);
     } else if (strCurrent === costItem) {
        itemCostsSame(costItem);
     } else if (strCurrent > costItem) {
        itemCostsMore(costItem);
     }
   });

//When exact change button clicked
$(".exact_only").click(function() {
    //Exact change is needed
    exactChange = true;
});

//When change ok button clicked
$(".change_ok").click(function() {
  //No exact change is needed
  exactChange = false;
});

//When return change button is clicked
$(".return_button").click(function() {
  //Return change
  if (currentChange > 0) {
    changeReturn();
  }
});

//When coin return screen clicked
$(".coin_return").click(function() {
  //Message returns to "Coin Return"
  $(this).html("<p>Coin Return</p>");
  //Resets screen
  screenMessage(screenDefault);
});