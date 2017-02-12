function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split("=");
        if(sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

function hex2bytearray (hex) {
    var arr = hex.match(/.{1,2}/g);
    var newarr = [];
    for (var i = 0; i < arr.length; i++) {
        var byte = arr[i];
        newarr.push(parseInt(byte, 16));
    }
    return newarr;
}

var gist = decodeURI(GetURLParameter("gist"));
var key = hex2bytearray(decodeURI(GetURLParameter("key")));
var iv = hex2bytearray(decodeURI(GetURLParameter("iv")));

var github_api = "https://api.github.com/";
var gist_api = "gists/";

$.get(github_api + gist_api + gist, function (data) {
    if (data.files) {
        var files = data.files;
        var targetFile = files[Object.keys(files)[0]];
        var encodedData = targetFile.content;
        var encryptedData = hex2bytearray(encodedData);
        var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
        var decryptedData = aesCbc.decrypt(encryptedData);
        var decryptedText = aesjs.utils.utf8.fromBytes(decryptedData);
        $("#note").html(decryptedText);
    }
});

console.log(key, iv);