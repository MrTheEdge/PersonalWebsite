// Hopefully, a close to *true* random number generator.
//
// But what do I know, I just did a little reading on the internet.

var clickMillis;

 document.onmousemove = function(event){
   addEntropy(event.pageX.toString());
   addEntropy(event.pageY.toString());
 }

 document.onmousedown = function(event){
   clickMillis = (new Date()).getMilliseconds();
 }

 document.onmouseup = function(event){
   addEntropy(((new Date()).getMilliseconds() - clickMillis).toString());
 }

 document.onkeypress = function(event){
   addEntropy(event.keyCode.toString());
 }

var entropyPool = "";
var hash;
var randString = "";
var randBitString = "";

function addEntropy(entropy){
  entropyPool += entropy;

  if (entropyPool.length >= 256){
    console.log(entropyPool);
    hash = CryptoJS.SHA256(entropyPool);
    randString += hash.toString(CryptoJS.enc.Hex);
    entropyPool = "";
    console.log(randString);
  }
}

function getRandomBit(){
  if (randString.length == 0 && randBitString.length==0){
    return null;
  }

  // Convert hexadecimal randString to string of bits;
  if (randString.length > 0){
    randBitString += hexToBinary(randString).result;
    console.log(randBitString);
  }

  var bit = randBitString.slice(0, 1);
  randBitString = randBitString.slice(1);

  return bit*1;

}

// Taken from StackOverflow: http://stackoverflow.com/questions/17204912/javascript-need-functions-to-convert-a-string-containing-binary-to-hex-then-co
// converts hexadecimal string to a binary string
// returns an object with key 'valid' to a boolean value, indicating
// if the string is a valid hexadecimal string.
// If 'valid' is true, the converted binary string can be obtained by
// the 'result' key of the returned object
function hexToBinary(s) {
    var i, k, part, ret = '';
    // lookup table for easier conversion. '0' characters are padded for '1' to '7'
    var lookupTable = {
        '0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100',
        '5': '0101', '6': '0110', '7': '0111', '8': '1000', '9': '1001',
        'a': '1010', 'b': '1011', 'c': '1100', 'd': '1101',
        'e': '1110', 'f': '1111',
        'A': '1010', 'B': '1011', 'C': '1100', 'D': '1101',
        'E': '1110', 'F': '1111'
    };
    for (i = 0; i < s.length; i += 1) {
        if (lookupTable.hasOwnProperty(s[i])) {
            ret += lookupTable[s[i]];
        } else {
            return { valid: false };
        }
    }
    return { valid: true, result: ret };
}

function drawBarChart(){
  var aData = randomAnalysis(randBitString);
  var ctx = document.getElementById("frequencyChart").getContext("2d");

  var data = {
    labels: ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"],
    datasets: [
        {
            label: "Zeroes Frequency",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [aData.one0, aData.two0, aData.three0, aData.four0, aData.five0, aData.six0, aData.seven0, aData.eight0]
        },
        {
            label: "Ones Frequency",
            fillColor: "rgba(151,187,205,0.5)",
            strokeColor: "rgba(151,187,205,0.8)",
            highlightFill: "rgba(151,187,205,0.75)",
            highlightStroke: "rgba(151,187,205,1)",
            data: [aData.one1, aData.two1, aData.three1, aData.four1, aData.five1, aData.six1, aData.seven1, aData.eight1]
        }
    ]
  };

  var frequencyChart = new Chart(ctx).Bar(data);

  frequencyChart.update();


}

function randomAnalysis(bitString){

  return {
    one1 : bitString.match(/1/g).length,
    one0 : bitString.match(/0/g).length,
    two1 : bitString.match(/11/g).length,
    two0 : bitString.match(/00/g).length,
    three1 : bitString.match(/111/g).length,
    three0 : bitString.match(/000/g).length,
    four1 : bitString.match(/1111/g).length,
    four0 : bitString.match(/0000/g).length,
    five1 : bitString.match(/11111/g).length,
    five0 : bitString.match(/00000/g).length,
    six1 : bitString.match(/111111/g).length,
    six0 : bitString.match(/000000/g).length,
    seven1 : bitString.match(/1111111/g).length,
    seven0 : bitString.match(/0000000/g).length,
    eight1 : bitString.match(/11111111/g).length,
    eight0 : bitString.match(/00000000/g).length
  };

}
