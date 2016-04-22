'use strict';

angular.module('artscan.controllers')
.controller('ScanCtrl', function($scope,$state,$http) {

    //take picture
    $scope.takePicture = function () {

            // var options = {
            //     quality: 50,
            //     sourceType: 1,    // 0:Photo Library, 1=Camera, 2=Saved Album
            //     encodingType: 0,      // 0=JPG 1=PNG
            //     correctOrientation: true,
            //     allowEdit: false
            // };

        //destination type is a base64 encoding
        // TODO - per the documentation at https://cordova.apache.org/docs/en/3.0.0/cordova_camera_camera.md.html, there might be memory issues with using this base 64 destination type
        navigator.camera.getPicture(onSuccess, onFail, { quality: 75, targetWidth: 320,
            targetHeight: 240, destinationType: 0 });

        function onSuccess(imageData) {
            var url = "https://search.craftar.net/v1/search";

            var fd = new FormData();
            fd.append('token', '2334158676a2484b');

            var binaryData = convertBase64ToBinary(imageData);
            var tempArray = new Array(binaryData);
            var tempBlob = new Blob(tempArray, {type : 'image/jpeg'}); // the blob
            fd.append('image', tempBlob);


            $http.post(url, fd, {
                headers: {'Content-Type': undefined}
            })
            .success(function (response) {
                console.log('Response: '+JSON.stringify(response));
                // temporary display on the device the success response - should be replaced by proper UI
                //alert("Search API Success - response - " + JSON.stringify(response));
                console.log("Search API Success - response - " + JSON.stringify(response));
                if(response.results.length == 0) { // no match -> redirect to add art
                    var picData = "data:image/jpeg;base64," +imageData;
                    $state.go("tab.addart", {'image':picData});
                } else {
                    // get uuid, find artwork id and redirect to art detail page
                    var uuid = response.results.item.uuid;
                }
            })
            .error(function (error, status, headers, config) {
                console.log('Error: '+JSON.stringify(error));
                console.log('Status: '+JSON.stringify(status));
                console.log('Headers: '+JSON.stringify(headers));
                console.log('Config: '+JSON.stringify(config));
                // temporary display on the device the error response - should be replaced by proper UI
                //alert("Search API Error - error - " + JSON.stringify(error));
            });

        }

        function onFail(message) {
            console.log("In getPicture on Fail - message - " + message);
        }

        function convertBase64ToBinary(base64Image) {
            var binaryImg = atob(base64Image);
            var length = binaryImg.length;
            var arrayBuffer = new ArrayBuffer(length);
            var uintArray = new Uint8Array(arrayBuffer);
            for (var i = 0; i < length; i++) {
                uintArray[i] = binaryImg.charCodeAt(i);
            }
            return uintArray;
        }
   }
})