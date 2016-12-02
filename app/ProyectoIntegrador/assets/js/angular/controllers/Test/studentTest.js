app.controller("studentTestTakenController",["$scope","$document","$http","$location","$rootScope",'globalVariables',function($scope,$document,$http,$location,$rootScope, globalVariables){
  $rootScope.loggedUser={};
  $rootScope.activeTest={};
  $rootScope.loggedUser.email="test3@test.com";
  $rootScope.activeTest.id=6;
  if(!$rootScope.loggedUser.email ||!$rootScope.activeTest.id){
    $location.path('/home');
  }else{

    /*Loading the test*/
    var instructionSpoken=false;
    //Narrador
    $rootScope.msg = new SpeechSynthesisUtterance();
    $rootScope.synth = window.speechSynthesis;
    $rootScope.synth.onvoiceschanged = function() {
      voices = $rootScope.synth.getVoices();
      console.log(voices);
      $rootScope.msg.rate = 0.8;
      $rootScope.msg.voice = voices[6]; // Note: some voices don't support altering params
      $rootScope.msg.lang = 'es-US';
      if(instructionSpoken==false){
        $rootScope.synth.cancel();
        $rootScope.msg.text="Instrucciones: teclas arriba y abajo para moverse entre opciones y preguntas. Derecha e izquierda para moverse entre preguntas. Espacio para seleccionar la opción. Control para iniciar la prueba";

      }
      $rootScope.synth.speak($rootScope.msg);
      instructionSpoken=true;
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


    /*Format test from server format to client format*/

    $scope.formatTestToBeTaken=function(test){
      for(var i=0;i<test.questions.length;i++){
        test.questions[i].texto=test.questions[i].text;
        test.questions[i].respuestas=[];
        test.questions[i].respuestas=test.questions[i].options;

        delete test.questions[i].options;
        for(var j=0;j<test.questions[i].respuestas.length;j++){
          test.questions[i].respuestas[j].texto=test.questions[i].respuestas[j].text;
          test.questions[i].respuestas[j].correcta=test.questions[i].respuestas[j].isCorrect;
          test.questions[i].respuestas[j].seleccionada=false;
        }
      }
    },






    //funcion generadora de index
    $scope.generarIndex=function(){
      $scope.mapeador=[];
      var counter=0;
      for(var i=0;i<$scope.preguntas.length;i++){
        counter++;
        $scope.preguntas[i].index=counter;
        var mapped={
          idOriginal:$scope.preguntas[i].id,
          index:$scope.preguntas[i].index
        }
        $scope.mapeador.push(mapped);
        for(var j=0;j<$scope.preguntas[i].respuestas.length;j++){
          counter++;
          $scope.preguntas[i].respuestas[j].index=counter;
          var mapped={
            idOriginal:$scope.preguntas[i].respuestas[j].id,
            index:$scope.preguntas[i].respuestas[j].index
          }
          $scope.mapeador.push(mapped);
        }
      }
      console.log($scope.mapeador);
      $scope.lastIndex=counter;
    }





    //funcion buscar siguiente pregunta
    $scope.buscarSigPregunta=function(indexPregunta){
      var idOriginal=$scope.buscarIdOriginalPreguntaByIndex(indexPregunta);
      if(idOriginal){
        for(var i=0;i<$scope.preguntas.length;i++){
          if($scope.preguntas[i].id==idOriginal){
            if(i<($scope.preguntas.length-1)){
              var idSiguientePregunta=$scope.preguntas[i+1].id;
              var indexSiguientePregunta=$scope.buscarIndexPreguntaByIdOriginal(idSiguientePregunta);
              return indexSiguientePregunta;
            }else{
              var idSiguientePregunta=$scope.preguntas[0].id;
              var indexSiguientePregunta=$scope.buscarIndexPreguntaByIdOriginal(idSiguientePregunta);
              return indexSiguientePregunta;
            }
          }
        }
      }
    }

    //funcion buscar anterior pregunta
    $scope.buscarAntPregunta=function(indexPregunta){
      var idOriginal=$scope.buscarIdOriginalPreguntaByIndex(indexPregunta);
      if(idOriginal){
        for(var i=0;i<$scope.preguntas.length;i++){
          if($scope.preguntas[i].id==idOriginal){
            if(i>0){
              var idSiguientePregunta=$scope.preguntas[i-1].id;
              var indexSiguientePregunta=$scope.buscarIndexPreguntaByIdOriginal(idSiguientePregunta);
              return indexSiguientePregunta;
            }else{
              var idSiguientePregunta=$scope.preguntas[$scope.preguntas.length-1].id;
              var indexSiguientePregunta=$scope.buscarIndexPreguntaByIdOriginal(idSiguientePregunta);
              return indexSiguientePregunta;
            }
          }
        }
      }
    }

    //buscar IdOriginal Pregunta By Index, sirve tambien para respuestas
    $scope.buscarIdOriginalPreguntaByIndex=function(indexPregunta){
      for(var i=0;i<$scope.mapeador.length;i++){
        if($scope.mapeador[i].index==indexPregunta){
          var idOriginal=$scope.mapeador[i].idOriginal;
          return idOriginal;
        }
      }
    }


    //buscar index Pregunta By idOriginal, sirve tambien para respuestas
    $scope.buscarIndexPreguntaByIdOriginal=function(idPregunta){
      for(var i=0;i<$scope.mapeador.length;i++){
        if($scope.mapeador[i].idOriginal==idPregunta){
          var indexPregunta=$scope.mapeador[i].index;
          return indexPregunta;
        }
      }
    }

    //Buscar a que pregunta pertenece la respuesta
    $scope.buscarPreguntaByRespuesta=function(idRespuesta){
      for(var i=0;i<$scope.preguntas.length;i++){
        for(var j=0;j<$scope.preguntas[i].respuestas.length;j++){
          if($scope.preguntas[i].respuestas[j].id==idRespuesta){
            var idPregunta=$scope.preguntas[i].id;
            return idPregunta;
          }
        }
      }
    }

    //Funcion para limpiar las respuestas seleccionadas de la pregunta
    $scope.limpiarRespuestaSeleccionadaByPregunta=function(idPregunta){
      for(var i=0;i<$scope.preguntas.length;i++){
        if($scope.preguntas[i].id==idPregunta){
          for(var j=0;j<$scope.preguntas[i].respuestas.length;j++){
            $scope.preguntas[i].respuestas[j].seleccionada=false;
            //quitar estilo
            document.getElementById("r"+$scope.preguntas[i].respuestas[j].index).classList.remove("seleccionada");
          }
        }
      }
    }
    //funcion seleccionar
    $scope.seleccionarRespuesta=function(indexRespuesta){
      var idRespuesta=$scope.buscarIdOriginalPreguntaByIndex(indexRespuesta);
      var idPregunta=$scope.buscarPreguntaByRespuesta(idRespuesta);
      if(idPregunta){
        $scope.limpiarRespuestaSeleccionadaByPregunta(idPregunta);
      }
      if(idRespuesta && idPregunta){
        for(var i=0;i<$scope.preguntas.length;i++){
          for(var j=0;j<$scope.preguntas[i].respuestas.length;j++){
            if($scope.preguntas[i].respuestas[j].id==idRespuesta){
              $scope.preguntas[i].respuestas[j].seleccionada=true;
              document.getElementById("r"+$scope.preguntas[i].respuestas[j].index).classList.add("seleccionada");
            }
          }
        }
      }
    }
    //Dar efecto de selección
    $scope.efectoSeleccion=function(index){
      var idRespuesta=$scope.buscarIdOriginalPreguntaByIndex(index);
    }


    //peticion http con los datos
    $scope.guardarDatos=function(){
      var datosEnviar=JSON.parse(JSON.stringify($scope.preguntas));
      $http({
        method: 'POST',
        url: 'http://186.4.134.233:1337/testData',
        data:datosEnviar
      }).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        console.log(response);
      }, function errorCallback(response) {
        console.log(response);
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
    }
    //Valores de angular
    //Eventos de presionar
    $document.unbind('keydown').bind("keydown",function(event){
      //  console.log(event);
      //CTRL
      if(event.which==17){
        $rootScope.synth.cancel();

        document.getElementById("p1").focus();
        $scope.elementoFocus="p1";
        $scope.ultimaPregunta="p1";

      }

      //numero es el valor del id
      //arriba
      if(event.which==38){
        $rootScope.synth.cancel();
        console.log("Evento:");
        console.log(event);
        var matchings=$scope.elementoFocus.match(/[p,r](\d*)/);
        console.log("Match:");
        console.log(matchings);
        var numero=Number(matchings[1])-1;
        if(document.getElementById("r"+numero)){
          document.getElementById("r"+numero).focus();
        }
        if(document.getElementById("p"+numero)){
          document.getElementById("p"+numero).focus();
          $scope.ultimaPregunta="p"+numero;
        }



      }
      //abajo
      if(event.which==40){
        $rootScope.synth.cancel();
        console.log("Evento:");
        console.log(event);
        var matchings=$scope.elementoFocus.match(/[p,r](\d*)/);
        var numero=Number(matchings[1])+1;
        if(document.getElementById("r"+numero)){
          document.getElementById("r"+numero).focus();
        }
        if(document.getElementById("p"+numero)){
          document.getElementById("p"+numero).focus();
          $scope.ultimaPregunta="p"+numero;
        }
      }
      //derecha
      if(event.which==39){
        $rootScope.synth.cancel();
        var matchings=$scope.ultimaPregunta.match(/p(\d*)/);
        console.log(matchings);
        var numero=$scope.buscarSigPregunta(Number(matchings[1]));
        console.log(numero);
        if(document.getElementById("p"+numero)){
          document.getElementById("p"+numero).focus();
          $scope.ultimaPregunta="p"+numero;
        }

      }
      //izquierda
      if(event.which==37){
        $rootScope.synth.cancel();
        var matchings=$scope.ultimaPregunta.match(/p(\d*)/);
        console.log(matchings);
        var numero=$scope.buscarAntPregunta(Number(matchings[1]));
        console.log(numero);
        if(document.getElementById("p"+numero)){
          document.getElementById("p"+numero).focus();
          $scope.ultimaPregunta="p"+numero;
        }

      }

      //espacio
      if(event.which==32){
        $rootScope.synth.cancel();
        /*
        console.log("Evento: Espacio");
        console.log(event);
        */
        var matchings=$scope.elementoFocus.match(/[p,r](\d*)/);
        var numero=Number(matchings[1]);
        if(numero==($scope.lastIndex+1)){
          $scope.guardarDatos();
          $rootScope.msg.text="Evaluación enviada con éxito";
          $rootScope.synth.speak($rootScope.msg);
        }
        if(document.getElementById("r"+numero)){
          $scope.seleccionarRespuesta(numero);
          $rootScope.msg.text="Opción seleccionada con éxito";
          $rootScope.synth.speak($rootScope.msg);
        }

        console.log("preguntas a enviar")
        console.log($scope.preguntas);
        $rootScope.preguntasEnviadas=$scope.preguntas;
        console.log("imprimiendo preguntas enviadas");
        console.log($rootScope.preguntasEnviadas);
        $location.path('/student/test/review');
      }
    });
    //al hacer focus
    $document.unbind('focusin').bind("focusin",function(event){
      console.log("se hizo focus");
      console.log(event.target.id);
      $scope.elementoFocus=event.target.id;
      console.log(document.getElementById($scope.elementoFocus));
      speakP();

    });
    function speakP(){
      var textoP=document.getElementById($scope.elementoFocus).innerHTML;
      $rootScope.msg.text=textoP;
      $rootScope.synth.speak($rootScope.msg);
      console.log($rootScope.synth);
    }
    $scope.preguntas=[];
    $http({
      method:'POST',
      url:globalVariables.url+'/test/getTestByIdForStudent',
      data:{
        user:{
          email:$rootScope.loggedUser.email
        },
        test:{
          id:$rootScope.activeTest.id
        }

      }
    }).then(function success(response){
      console.log(response);
      $scope.test=response.data.test;
      $scope.formatTestToBeTaken($scope.test);
      $scope.preguntas=$scope.test.questions;

      console.log($scope.preguntas);
      $scope.generarIndex();
      console.log($scope.preguntas);
      console.log($scope.test);
    }, function error(response){
      console.log(response);
    })

  }
}]);
