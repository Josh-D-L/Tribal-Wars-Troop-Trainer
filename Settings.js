javascript:
function isAlpha(string) {
    var patt = /^[a-zA-Z]+$/;
    return patt.test(string);
}
function isArray(string) {
    var patt1 = /^[',',' ',0-9]+$/;
    return patt1.test(string);
}
function isNumber(string) {
    var patt2 = /^[0-9]+$/;
    return patt2.test(string);
}
function Setup() {
	alert("First, we will set some settings.");
	var tellTrainTime = confirm("Would you like the script to display your remaining train time after recruiting each time?");
	if (tellTrainTime === true) {
		tellTrainTime = 1;
	} else {
		tellTrainTime = 0;
	}
	var tellPercentDone = confirm("Would you like the script to display the percentage of troops you have trained after recruiting each time?");
	if (tellPercentDone === true) {
		tellPercentDone = 1;
	} else {
		tellPercentDone = 0;
	}
	var tellInsufficientRes = confirm("Would you like the script to tell you when you don't have enough resources and what the required amound is?");
	if (tellInsufficientRes === true) {
		tellInsufficientRes = 1;
	} else {
		tellInsufficientRes = 0;
	}
	var configCreator;
	var configName;
	var configConfirmName;
	var configConfirmTroops;
	var configTroops;
	var configTroopsList = [];
	var configNameList = [];
	var Check;
	alert("We will now create your troop configurations!");
	while (configCreator !== false) {
		configConfirmName = false;
		while(configConfirmName === false) {
			configName = prompt("What would you like to name your troop configuration? Letters only, no numbers, commas, or spaces.");
			Check = isAlpha(configName);
			if (Check === true) {
				configConfirmName = confirm("Is this correct? > " + configName);
			}
			else {
				configConfirmName = false;
				alert("You used a character that was not allowed. Please try again.");
			}
		}
		configConfirmTroops = false;
		while(configConfirmTroops === false) {
			configTroops = prompt("Replace each word with the number of the troop you want to have in this configuration.", "Spears, Swords, Axes, Scouts, Light, Heavy, Rams, Catapults");
			Check = isArray(configTroops);
			if (Check === true) {
				if (configTroops.split(",").length == 8) {
					configConfirmTroops = confirm("Is this correct? > " + configTroops);
				}
				else {
					configConfirmTroops = false;
					alert("You used too many or too few numbers. Please try again.");
				}
			}
			else {
				configConfirmTroops = false;
				alert("You used a character that was not allowed. Please try again.");
			}
		}
		configTroopsList.push(configTroops);
		configNameList.push(configName);
		configCreator = confirm("Would you like to create another troop configuration?");
	}
	alert("Next, we will set up each villages individual settings.");
	var villageCreator;
	var villageConfig;
	var villageConfirmConfig;
	var villageConfigList = [];
	var villageDefaultRes;
	var villageConfirmDefaultRes;
	var villageResList = [];
	var villageResearch;
	var villageConfirmResearch;
	var villageResearchList = [];
	var villageId;
	var villageConfirmId;
	var villageIdList = [];
	while (villageCreator !== false) {
		villageConfirmConfig = false;
		while(villageConfirmConfig === false) {
			villageConfig = prompt("What troop configuration would you like to use in this village? Erase all the names except the one you want.", configNameList);
			Check = $.inArray(villageConfig, configNameList);
			if (Check > -1) {
				villageConfirmConfig = confirm("Is this correct? > " + villageConfig);
			}
			else {
				villageConfirmConfig = false;
				alert("Your configuration does not match any of the created configurations. Please try again.");
			}
		}
		villageConfirmDefaultRes = false;
		while(villageConfirmDefaultRes === false) {
			villageDefaultRes = Math.round(prompt("What would you like your default resource usage percentage to be in this village?", 100));		
			Check = isNumber(villageDefaultRes);
			if (Check === true) {
				if (villageDefaultRes >= 100 || villageDefaultRes <= 0) {
					villageConfirmDefaultRes = confirm("Is this correct? > " + villageDefaultRes);
				}
				else {
					villageConfirmDefaultRes = false;
					alert("Your number was too small or too large. Please try again.");
				}
			}
			else {
				villageConfirmDefaultRes = false;
				alert("You used a character that was not allowed. Please try again.");
			}
		}
		villageConfirmResearch = false;
		while(villageConfirmResearch === false) {
			villageResearch = prompt("Which of these troops are unlocked? Replace the name with 1 if it's unlocked and 0 if it isn't.", "Spears, Swords, Axes, Scouts, Light, Heavy, Rams, Catapults");
			Check = isArray(villageResearch);
			if (Check === true) {
				if (villageResearch.split(",").length == 8) {
					villageConfirmResearch = confirm("Is this correct? > " + villageResearch);
				}
				else {
					villageConfirmResearch = false;
					alert("You used too many or too few numbers. Please try again.");
				}
			}
			else {
				villageConfirmResearch = false;
				alert("You used a character that was not allowed. Please try again.");
			}
		}
		villageConfirmId = false;
		while(villageConfirmId === false) {
			villageId = prompt("What is the 6-Digit Id of this village?");
			Check = isNumber(villageId);
			if (Check === true) {
				if (villageId.length == 6) {
					villageConfirmId = confirm("Is this correct? > " + villageId);
				}
				else {
					villageConfirmId = false;
					alert("You used too many characters! Please try again.");
				}
			}
			else {
				villageConfirmId = false;
				alert("You used a character that was not allowed. Please try again.");
			}
		}
		villageConfigList.push(villageConfig);
		villageResList.push(villageDefaultRes);
		villageResearchList.push(villageResearch);
		villageIdList.push(villageId);
		villageCreator = confirm("Would you like to add another village?");
	}
	var configNameListLength = configNameList.length;
	var configurations = "";
	for (var configNumber = 0; configNumber < configNameListLength; configNumber++) {
		configurations = configurations + "var config" + configNameList[configNumber] + " = [" + configTroopsList[configNumber] + "];";
	}
	var villageIdListLength = villageIdList.length;
	var villages = "";
	var location = "";
	for (var vilNumber = 0; vilNumber < villageIdListLength; vilNumber++) {
		villages = villages + "function V" + vilNumber + "() {vilConfig = config" + villageConfigList[vilNumber] + ";" + "resPercentage = prompt('What percentage of resources would you like to use?', " + villageResList[vilNumber] + "); research = [" + villageResearchList[vilNumber] + "];}";
		location = location + "if (window.location.href.indexOf(" + villageIdList[vilNumber] + ") > -1) {V" + vilNumber + "();}";
	}
	alert("You have finished! Copy and paste this into the Updater Script");
	var win = window.open('', 'TroopTrainerScript', 'height=480,width=640', false);
	win.document.body.innerHTML = code[0] + tellTrainTime + code[1] + tellPercentDone + code[2] + tellInsufficientRes + code[3] + configurations + villages + location + "/**/ ";
}
alert("Before you can start, you will need to know the research status of all of your villages, what their ID is in the URL of any page where you are in that village, and your desired troop counts");
var code = ["javascript: var tellTrainTime = ", ";var tellPercentDone = ", ";var tellInsufficientRes =", "var vilConfig;var resPercentage;var research;"];
var start = confirm("This is the setup Code for ZPieGuy's Troop Trainer         Would you like to proceed?                                  Press Okay to continue, or Cancel to exit");
if (start === true) {
	Setup();
}
