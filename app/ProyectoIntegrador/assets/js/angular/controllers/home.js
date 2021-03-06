app.controller('homeController',['$scope','$http','$location','toastr','globalVariables','$rootScope','$document','$state',function($scope,$http,$location,toastr,globalVariables,$rootScope,$document,$state){
  if($rootScope.loggedUser){
    if($rootScope.loggedUser.role){
      $location.path('/'+$rootScope.loggedUser.role+'/home');
    }
  }else{
    $scope.createUser=function(){
      $rootScope.synth.cancel();
      $document.unbind('keydown');
      $state.go('registerUser');
    }
    $scope.recoverPassword=function(){
      $rootScope.synth.cancel();
      $document.unbind('keydown');
      $state.go('recoverPassword');
    }
    $scope.user={};
    $scope.login=function(){
      $http({
        method:'POST',
        url:globalVariables.url+'/login',
        data:{
          user:{
            email:$scope.user.email,
            password:$scope.user.password,
            role:$scope.user.role,
            pin:$scope.user.pin
          }
        }
      }).then(function success(response){
        if(response.data.msgES){
          var msgES=response.data.msgES;
        }else{
          var msgES="Sesión iniciada";
        }
        toastr.success(msgES,"Success");
        console.log(response);
        $rootScope.loggedUser={};
        $rootScope.loggedUser.email=response.data.email;
        $rootScope.loggedUser.role=response.data.role;
        $rootScope.synth.cancel();
        $rootScope.msg.text="Sesión iniciada con éxito";
        $rootScope.synth.speak($rootScope.msg);
        $document.unbind('keydown');
        if($rootScope.loggedUser.role=='student'){
          $state.go('homeStudent');
        }
        if($rootScope.loggedUser.role=='teacher'){
          $state.go('homeTeacher');
        }
      }, function error(response){
        if(response.data.msgES){
          var msgES=response.data.msgES;
        }else{
          var msgES="Sesión no iniciada";
        }
        toastr.error(msgES,"Error");
        $rootScope.synth.cancel();
        $rootScope.msg.text="Error al iniciar sesión";
        $rootScope.synth.speak($rootScope.msg);
        console.log(response);
      })
    }

    /*Text to voice*/
    if(!$rootScope.msg & !$rootScope.synth){
      $rootScope.msg = new SpeechSynthesisUtterance();
      $rootScope.synth = window.speechSynthesis;
      $rootScope.msg.rate =0.9;
      $rootScope.msg.lang='es-US';
    }
    $rootScope.synth.onvoiceschanged = function() {
      voices = $rootScope.synth.getVoices();
      console.log(voices);
      //$rootScope.msg.voice = voices[6]; // Note: some voices don't support altering params
      $rootScope.synth.speak($rootScope.msg);
    }

    var finishedSpeaking=false;
    $rootScope.msg.onstart=function(event){
      finishedSpeaking=false;
      console.log("On start");
    }
    $rootScope.msg.onend=function(event){
      finishedSpeaking=true;
      console.log("On end");
    }


    /*voz a texto*/

    var final_transcript = '';
    var recognizing = false;
    var ignore_onend;
    var start_timestamp;
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-US';
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
      loginWithVoice();
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

    function loginWithVoice(){
      console.log(final_transcript);
      var numbers=final_transcript.match(/(\d{1})/g);
      if(!numbers){
        $rootScope.synth.cancel();
        $rootScope.msg.text="No dictó un pin correcto";
        $rootScope.synth.speak($rootScope.msg);
        return;
      }
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
        $scope.user.pin=pinNumber;
        $scope.login();
      }else{
        $rootScope.synth.cancel();
        $rootScope.msg.text="No dictó un pin correcto";
        $rootScope.synth.speak($rootScope.msg);
      }
    }

    /*Keybinding*/
    $document.unbind('keydown').bind("keydown",function(event){
      //CTRL
      if(event.which==17){
        if(finishedSpeaking==false){
          $rootScope.synth.cancel();
        }else{
          $rootScope.synth.speak($rootScope.msg);
        }
      }
      //espacio
      if(event.which==32){
        $rootScope.synth.cancel();
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




    function init(){
      if($rootScope.synth && $rootScope.msg){
        $rootScope.synth.cancel();
        $rootScope.msg.text="Ventana de login. Presione la tecla espacio para iniciar la captura de audio. Dicte su pin. Presione la tecla espacio nuevamente para terminar de capturar el audio. Y finalmente presione la tecla alt";
        $rootScope.synth.speak($rootScope.msg);
      }
    }
    init();

  }

}]);
