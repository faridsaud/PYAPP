app.controller('homeController',['$scope','$http','$location','toastr','globalVariables','$rootScope','$document',function($scope,$http,$location,toastr,globalVariables,$rootScope,$document){
  if($rootScope.loggedUser){
    if($rootScope.loggedUser.role){
      console.log("estamos aqui");
      $location.path('/'+$rootScope.loggedUser.role+'/home');
    }
  }else{
    console.log("home controller");
    $scope.login=function(){
      $http({
        method:'POST',
        url:globalVariables.url+'/login',
        data:{
          user:{
            email:$scope.user.email,
            password:$scope.user.password,
            role:$scope.user.role
          }
        }
      }).then(function success(response){
        toastr.success("Login con éxito","Success");
        console.log(response);
        $rootScope.loggedUser={};
        $rootScope.loggedUser.email=response.data.email;
        $rootScope.loggedUser.role=response.data.role;
        $location.path('/'+response.data.role+'/home');
      }, function error(response){
        toastr.error(response.data.msg,"Error");
        console.log(response);
      })
    }

    /*Text to voice*/
    var instructionSpoken=false;
    if(!$rootScope.msg & !$rootScope.synth){
      $rootScope.msg = new SpeechSynthesisUtterance();
      $rootScope.synth = window.speechSynthesis;
      $rootScope.msg.rate =0.9;
      $rootScope.msg.lang='es-US';
    }
    $rootScope.synth.onvoiceschanged = function() {
      voices = $rootScope.synth.getVoices();
      console.log(voices);
      console.log("Entrando a hablar");
      $rootScope.msg.voice = voices[6]; // Note: some voices don't support altering params
      if(instructionSpoken==false){
        $rootScope.synth.cancel();
        $rootScope.msg.text="Ventana de login. Presione la tecla espacio. Dicte su pin. Presione la tecla espacio nuevamente para terminar de capturar el audio. Y finalmente presione la tecla alt";
      }
      $rootScope.synth.speak($rootScope.msg);
      instructionSpoken=true;
    }


    $document.unbind('keydown').bind("keydown",function(event){
      //CTRL
      if(event.which==17){
        $rootScope.synth.cancel();
        $rootScope.msg.text="Ventana de login. Presione la tecla espacio. Dicte su pin. Presione la tecla espacio nuevamente para terminar de capturar el audio. Y finalmente presione la tecla alt";
        $rootScope.synth.speak($rootScope.msg);
      }
      //ALT
      if(event.which==18){
        var numbers=final_transcript.match(/(\d{1})/g);
        if(numbers.length>1){
          var pinText="";
          var pinNumber="";
          for(var i=0;i<numbers.length;i++){
            var pinText=pinText+numbers[i].toString()+" ";
            var pinNumber=pinNumber+numbers[i].toString();
          }
          console.log(pinText);
          console.log(pinNumber);
          $rootScope.synth.cancel();
          $rootScope.msg.text="Pin a enviar: "+pinText;
          $rootScope.synth.speak($rootScope.msg);
        }else{

          $rootScope.synth.cancel();
          $rootScope.msg.text="No dictó un pin correcto";
          $rootScope.synth.speak($rootScope.msg);
        }
      }
      //espacio
      if(event.which==32){
          $rootScope.synth.cancel();
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

    /*voz a texto*/

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




  }

}]);
