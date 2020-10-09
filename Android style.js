/*
 * Change the widget settings and test out the widget in this section.
 * ===================================================================
 */
/* -- PREVIEW YOUR WIDGET -- */
// Change to true to see a preview of your widget.
const testMode = true
// Optionally specify the size of your widget preview.
const widgetPreview = "large"
/* -- SPACING -- */
// Can be top, middle, or bottom.
const verticalAlignment = "middle"
/* -- WEATHER -- */
// API Key and City Code
let API_WEATHER = "xxxxxxxxxxxxxxxxxxxxxxxx";//Load Your api here
let CITY_WEATHER = "111111";//add your city ID
/* -- RESET YOUR WIDGET -- */
// Change to true to reset the widget background.
const resetWidget = false
/* -- GLOBAL VALUES -- */
// Widgets are unique based on the name of the script.
const filename = Script.name() + ".jpg"
const files = FileManager.local()
const path = files.joinPath(files.documentsDirectory(), filename)
const fileExists = files.fileExists(path)
// Store other global values.
const calDate = new Date()
let widget = new ListWidget()
// If we're in the widget or testing, build the widget.
if (config.runsInWidget || (testMode && fileExists && !resetWidget)) {
widget.backgroundImage = files.readImage(path)

// Date
var today = new Date();

// iCloud file path
var scriptableFilePath = "/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/";

var fm = FileManager.iCloud();

//Get storage
var base_path = "/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/weather/";
var fm = FileManager.iCloud();

// Fetch Image from Url
async function fetchimageurl(url) {
	const request = new Request(url)
	var res = await request.loadImage();
	return res;
}

// Get formatted Date
function getformatteddate(){
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return months[today.getMonth()] + " " + today.getDate()
}

// Long-form days and months
var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// Load image from local drive
async function fetchimagelocal(path){
  var finalPath = base_path + path + ".png";
  if(fm.fileExists(finalPath)==true){
	console.log("file exists: " + finalPath);
	return finalPath;
  }else{
	//throw new Error("Error file not found: " + path);
	if(fm.fileExists(base_path)==false){
	  console.log("Directry not exist creating one.");
	  fm.createDirectory(base_path);
	}
	console.log("Downloading file: " + finalPath);
	await downloadimg(path);
	if(fm.fileExists(finalPath)==true){
	  console.log("file exists after download: " + finalPath);
	  return finalPath;
	}else{
	  throw new Error("Error file not found: " + path);
	}
  }
}

// Weather icons
async function downloadimg(path){
	const url = "http://a.animedlweb.ga/weather/weathers25_2.json";
	const data = await fetchWeatherData(url);
	var dataimg = null;
	var name = null;
	if(path.includes("bg")){
	  dataimg = data.background;
	  name = path.replace("_bg","");
	}else{
	  dataimg = data.icon;
	  name = path.replace("_ico","");
	}
	var imgurl=null;
	switch (name){
	  case "01d":
		imgurl = dataimg._01d;
	  break;
	  case "01n":
		imgurl = dataimg._01n;
	  break;
	  case "02d":
		imgurl = dataimg._02d;
	  break;
	  case "02n":
		imgurl = dataimg._02n;
	  break;
	  case "03d":
		imgurl = dataimg._03d;
	  break;
	  case "03n":
		imgurl = dataimg._03n;
	  break;
	  case "04d":
		imgurl = dataimg._04d;
	  break;
	  case "04n":
		imgurl = dataimg._04n;
	  break;
	  case "09d":
		imgurl = dataimg._09d;
	  break;
	  case "09n":
		imgurl = dataimg._09n;
	  break;
	  case "10d":
		imgurl = dataimg._10d;
	  break;
	  case "10n":
		imgurl = dataimg._10n;
	  break;
	  case "11d":
		imgurl = dataimg._11d;
	  break;
	  case "11n":
		imgurl = dataimg._11n;
	  break;
	  case "13d":
		imgurl = dataimg._13d;
	  break;
	  case "13n":
		imgurl = dataimg._13n;
	  break;
	  case "50d":
		imgurl = dataimg._50d;
	  break;
	  case "50n":
		imgurl = dataimg._50n;
	  break;
	}
	const image = await fetchimageurl(imgurl);
	console.log("Downloaded Image");
	fm.writeImage(base_path+path+".png",image);
}

//get Json weather
async function fetchWeatherData(url) {
  const request = new Request(url);
  const res = await request.loadJSON();
  return res;
}

// Get Location 
// Location.setAccuracyToBest();
// let curLocation = await Location.current();
// let wetherurl = "http://api.openweathermap.org/data/2.5/weather?lat=" + curLocation.latitude + "&lon=" + curLocation.longitude + "&appid=" + API_WEATHER + "&units=metric";
let wetherurl = "http://api.openweathermap.org/data/2.5/weather?id=" + CITY_WEATHER + "&APPID=" + API_WEATHER + "&units=metric";

const weatherJSON = await fetchWeatherData(wetherurl);
const weatherarry = weatherJSON.weather;
const iconData = weatherarry[0].icon;
const curTempObj = weatherJSON.main;
const curTemp = curTempObj.temp;

//Completed loading weather data
var holidayKey = (today.getMonth() + 1).toString() + "," +  (Math.ceil(today.getDate() / 7)).toString() + "," + (today.getDay()).toString();
var holidayKeyDate = (today.getMonth() + 1).toString() + "," + (today.getDate()).toString();

// Date Calculations
var weekday = days[ today.getDay() ];
var month = months[ today.getMonth() ];
var date = today.getDate();
var hour = today.getHours();

// Append ordinal suffix to date
function ordinalSuffix(input) {
	if (input % 10 == 1 && date != 11) {
		return input.toString() + "st";
	} else if (input % 10 == 2 && date != 12) {
		return input.toString() + "nd";
	} else if (input % 10 == 3 && date != 13) {
		return input.toString() + "rd";
	} else {
		return input.toString() + "th";
	}
}

// Generate date string
var datefull = weekday + ", " + month + " " + ordinalSuffix(date);

// Support for multiple greetings per time period
function randomGreeting(greetingArray) {
	return Math.floor(Math.random() * greetingArray.length);
}

let themeColor = new Color("ffffff");

/* --------------- */
/* Assemble Widget */
/* --------------- */
 
//Top spacing
widget.addSpacer(10);
 
let hStack = widget.addStack();
hStack.layoutHorizontally();

// Centers weather line
// hStack.addSpacer(35);
 
// Date label in stack
let datetext = hStack.addText(datefull + '\xa0\xa0\xa0\xa0');
datetext.font = Font.regularSystemFont(23);
datetext.textColor = themeColor;
datetext.centerAlignText();
 
//image
var img = Image.fromFile(await fetchimagelocal(iconData + "_ico"));
 
//image in stack
let widgetimg = hStack.addImage(img);
widgetimg.imageSize = new Size(25, 25);
widgetimg.centerAlignImage();
 
//tempeture label in stack
let temptext = hStack.addText('\xa0\xa0'+ Math.round(curTemp).toString()+"\u2103");
temptext.font = Font.regularSystemFont(23);
temptext.textColor = themeColor;
temptext.centerAlignText();

widget.setPadding(0, 0, 0, 0);
 
if (verticalAlignment == "top" || verticalAlignment == "middle") {
widget.addSpacer()
}
Script.setWidget(widget)
if (testMode) {
let widgetSizeFormat = widgetPreview.toLowerCase()
if (widgetSizeFormat == "small")  { widget.presentSmall()  }
if (widgetSizeFormat == "medium") { widget.presentMedium() }
if (widgetSizeFormat == "large")  { widget.presentLarge()  }
}
Script.complete()
// If we're running normally, go to the calendar.
} else if (fileExists && !resetWidget) {
const appleDate = new Date('2001/01/01')
const timestamp = (calDate.getTime() - appleDate.getTime()) / 1000
const callback = new CallbackURL("calshow:" + timestamp)
callback.open()
Script.complete()
// If it's the first time it's running, set up the widget background.
} else {
// Determine if user has taken the screenshot.
var message
message = "Before you start, go to your home screen and enter wiggle mode. Scroll to the empty page on the far right and take a screenshot."
let exitOptions = ["Continue", "Exit to Take Screenshot"]
let shouldExit = await generateAlert(message, exitOptions)
if (shouldExit) return
// Get screenshot and determine phone size.
let img = await Photos.fromLibrary()
let height = img.size.height
let phone = phoneSizes()[height]
if (!phone) {
message = "It looks like you selected an image that isn't an iPhone screenshot, or your iPhone is not supported. Try again with a different image."
await generateAlert(message, ["OK"])
return
}
// Prompt for widget size and position.
message = "What size of widget are you creating?"
let sizes = ["Small", "Medium", "Large"]
let size = await generateAlert(message, sizes)
let widgetSize = sizes[size]
message = "What position will it be in?"
message += (height == 1136 ? " (Note that your device only supports two rows of widgets, so the middle and bottom options are the same.)" : "")
// Determine image crop based on phone size.
let crop = { w: "", h: "", x: "", y: "" }
if (widgetSize == "Small") {
crop.w = phone.small
crop.h = phone.small
let positions = ["Top left", "Top right", "Middle left", "Middle right", "Bottom left", "Bottom right"]
let position = await generateAlert(message, positions)
// Convert the two words into two keys for the phone size dictionary.
let keys = positions[position].toLowerCase().split(' ')
crop.y = phone[keys[0]]
crop.x = phone[keys[1]]
} else if (widgetSize == "Medium") {
crop.w = phone.medium
crop.h = phone.small
// Medium and large widgets have a fixed x-value.
crop.x = phone.left
let positions = ["Top", "Middle", "Bottom"]
let position = await generateAlert(message, positions)
let key = positions[position].toLowerCase()
crop.y = phone[key]
} else if (widgetSize == "Large") {
crop.w = phone.medium
crop.h = phone.large
crop.x = phone.left
let positions = ["Top", "Bottom"]
let position = await generateAlert(message, positions)
// Large widgets at the bottom have the "middle" y-value.
crop.y = position ? phone.middle : phone.top
}
// Crop image and finalize the widget.
let imgCrop = cropImage(img, new Rect(crop.x, crop.y, crop.w, crop.h))
files.writeImage(path, imgCrop)
message = "Your widget background is ready. If you haven't already granted Calendar access, it will pop up next."
await generateAlert(message, ["OK"])
// Make sure we have calendar access.
await CalendarEvent.today([])
Script.complete()
}
/*
 * Helper functions
 * ================
 */
// Generate an alert with the provided array of options.
async function generateAlert(message, options) {
let alert = new Alert()
alert.message = message
for (const option of options) {
alert.addAction(option)
}
let response = await alert.presentAlert()
return response
}
// Crop an image into the specified rect.
function cropImage(img, rect) {
let draw = new DrawContext()
draw.size = new Size(rect.width, rect.height)
draw.drawImageAtPoint(img, new Point(-rect.x, -rect.y))
return draw.getImage()
}
// Pixel sizes and positions for widgets on all supported phones.
function phoneSizes() {
let phones = {
"2688": {
"small": 507,
"medium": 1080,
"large": 1137,
"left": 81,
"right": 654,
"top": 228,
"middle": 858,
"bottom": 1488
},
"1792": {
"small": 338,
"medium": 720,
"large": 758,
"left": 54,
"right": 436,
"top": 160,
"middle": 580,
"bottom": 1000
},
"2436": {
"small": 465,
"medium": 987,
"large": 1035,
"left": 69,
"right": 591,
"top": 213,
"middle": 783,
"bottom": 1353
},
"2208": {
"small": 471,
"medium": 1044,
"large": 1071,
"left": 99,
"right": 672,
"top": 114,
"middle": 696,
"bottom": 1278
},
"1334": {
"small": 296,
"medium": 642,
"large": 648,
"left": 54,
"right": 400,
"top": 60,
"middle": 412,
"bottom": 764
},
"1136": {
"small": 282,
"medium": 584,
"large": 622,
"left": 30,
"right": 332,
"top": 59,
"middle": 399,
"bottom": 399
},
"1624": {
"small": 310,
"medium": 658,
"large": 690,
"left": 46,
"right": 394,
"top": 142,
"middle": 522,
"bottom": 902 
}
}
return phones
}