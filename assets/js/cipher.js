var ASCII_STRING = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*-=_+';

$('#generateBtn').click(function(){
  var txt = $('#messageInput').val();
  if (txt.length > 0){
    var key = genKeyString(txt.length);
    $('#keyInput').val(key);
  }
});

$('#encodeBtn').click(function(){
  var message = $('#messageInput').val();
  var key = $('#keyInput').val();
  var cText = cipherText(message, key);

  $('#cipherText').val(encodeString(cText));
});

$('#decodeBtn').click(function(){
  var message = $('#messageInput').val();
  var key = $('#keyInput').val();
  message = decodeString(message);
  var cText = cipherText(message, key);

  $('#cipherText').val(cText);
});

$('#showInfoBtn').click(function(){
  $('#infoText').toggle("fast");
});

$('#keyCopyBtn').click(function(){
  $('#copyArea').val($('#keyInput').val());
});

$('#modal-content').on('shown.bs.modal', function() {
    $("#copyArea").select();
    $("#copyArea").focus();
});

function hexToDecimal(string) {
    return parseInt(string, 16);
}

function decimalToHex(num){
  return num.toString(16);
}

function decodeString(hex){
  var arr = hex.split(' ');
  var str = '';
  var char;

  for (var i = 0; i < arr.length; i++){
    char = String.fromCharCode(hexToDecimal(arr[i]));
    str += char;
  }
  return str;
}

function encodeString(cipherText){
  var str = '';
  for (var i = 0; i < cipherText.length; i++){
    str += decimalToHex(cipherText.charCodeAt(i)) + ' ';
  }
  return str.trim();
}

function genKeyString(length){
  var index;
  var keyString = "";
  for(var i = 0; i < length; i++){
    index = Math.floor(Math.random() * ASCII_STRING.length);
    keyString = keyString + ASCII_STRING.charAt(index);
  }

  return keyString;
}

function cipherText(message, key){
  var result = "";
  if (message.length <= key.length){
    for(var i = 0; i < message.length; i++){
      result += String.fromCharCode(message.charCodeAt(i) ^ key.charCodeAt(i));
    }
  } else {
    for (var i = 0, j = 0; i < message.length; i++){
      if (j == key.length){
        j = 0;
      }
      result += String.fromCharCode(message.charCodeAt(i) ^ key.charCodeAt(j));
      j++;
    }
  }
  return result;
}



// $('#copyKeyBtn').click( function(){
//   window.prompt("Copy to clipboard: Ctrl+C, Enter", "BLAH BLAH BLAH");
// });
