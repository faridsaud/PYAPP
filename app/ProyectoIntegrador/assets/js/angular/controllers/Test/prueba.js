app.controller("pruebaController",["$scope","$document","$http","$location","$rootScope",'globalVariables',"$state",function($scope,$document,$http,$location,$rootScope, globalVariables,$state){



  var final_transcript = '';
  var recognizing = false;
  var ignore_onend;
  var start_timestamp;
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function() {
    recognizing = true;
  };

  recognition.onend = function() {
    recognizing = false;
    if (ignore_onend) {
      return;
    }
    if (!final_transcript) {
      return;
    }
  };

  recognition.onresult = function(event) {
    var interim_transcript = '';
    if (typeof(event.results) == 'undefined') {
      recognition.onend = null;
      recognition.stop();
      return;
    }
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    console.log(final_transcript);
  };



  $document.unbind('keydown').bind("keydown",function(event){
    //  console.log(event);
    //CTRL
    if(event.which==17){
      console.log("texto a enviar "+final_transcript);
    }
    /**/


    //espacio
    if(event.which==32){
      console.log("here");
      if (recognizing) {
        recognition.stop();
        return;
      }
      final_transcript = '';
      recognition.lang = 'es-US';
      recognition.start();
      ignore_onend = false;

    }
  })

  function speakP(){
    var textoP=document.getElementById($scope.focusedElement).innerHTML;
    $rootScope.msg.text=textoP;
    $rootScope.synth.speak($rootScope.msg);
    console.log($rootScope.synth);
  }

}]);
