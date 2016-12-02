app.controller("studentTestReviewController",["$scope","$document","$http","$location","$rootScope",function($scope,$document,$http,$location,$rootScope){

  //Datos
  //Pregunta Opcion multiple
  var correctAnswers=0;
  var instructionSpoken=false;
  $scope.elementoFocus="p1";
  $scope.ultimaPregunta="p1";
  $scope.preguntas=$rootScope.preguntasEnviadas;
  if($scope.preguntas===undefined){
    $location.path('/test');
  }else{
    console.log($scope.preguntas);
    $scope.limpiarPreguntasEnviadas=function(){
      for(var i=0;i<$scope.preguntas.length;i++){
        if($scope.preguntas[i].id=="a6"){
          $scope.preguntas.splice(i,1);
        }
      }
      for(var i=0;i<$scope.preguntas.length;i++){
        var finishedDeleting=false;
        var agregada=false;
        while(finishedDeleting==false){
          var deleted=false;
          for(var j=0;j<$scope.preguntas[i].respuestas.length;j++){

            if($scope.preguntas[i].respuestas[j].correcta==true&&$scope.preguntas[i].respuestas[j].seleccionada==true&&agregada==false){
              correctAnswers++;
              $scope.preguntas[i].respuestas[j].seleccionada=false;
              $scope.preguntas[i].respuestas.push(JSON.parse(JSON.stringify($scope.preguntas[i].respuestas[j])));
              $scope.preguntas[i].respuestas[j].seleccionada=true;
              $scope.preguntas[i].respuestas[j].correcta=false;
              agregada=true;

            }
            if($scope.preguntas[i].respuestas[j].correcta==false&&$scope.preguntas[i].respuestas[j].seleccionada==false&&deleted==false){
              $scope.preguntas[i].respuestas.splice(j,1);
              deleted=true;
            }
          }
          if($scope.preguntas[i].respuestas.length==2){
            finishedDeleting=true;
          }
        }
      }
      console.log($scope.preguntas);
    }
    $scope.limpiarPreguntasEnviadas();
    //funcion generadora de index
    //funcion generadora de index
    console.log($scope.preguntas);

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
    $scope.generarIndex();





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
    /*
    var hablando=false;
    //funcion iniciarHablarRespuesta
    $scope.iniciarHablarRespuesta=function(indexPregunta){
      if(hablando==false){
        var idPregunta=$scope.buscarIdOriginalPreguntaByIndex(indexPregunta);
        if(idPregunta){
          for(var i=0;i<$scope.preguntas.length;i++){
            if($scope.preguntas[i].tipo=="completarHablando"){
              console.log(recognition);
              console.log("Entramos aqui");
              recognition.start();
              hablando=true;
            }
          }
        }
      }
    }

    //funcion paraHablarRespuesta
    $scope.pararHablarRespuesta=function(indexPregunta){
      var idPregunta=$scope.buscarIdOriginalPreguntaByIndex(indexPregunta);
      if(idPregunta){
        for(var i=0;i<$scope.preguntas.length;i++){
          if($scope.preguntas[i].tipo=="completarHablando"){
            console.log("Entramos a parar")
            recognition.stop();
            hablando=false;
          }
        }
      }
    }
    */
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
    //Pruebas
    console.log("Prueba buscar id por Index");
    console.log($scope.buscarIdOriginalPreguntaByIndex(1));

    console.log("Prueba buscar Index por Id");
    console.log($scope.buscarIndexPreguntaByIdOriginal("akfhj"));

    console.log("Prueba siguiente pregunta");
    console.log($scope.buscarSigPregunta(1));

    console.log("Prueba siguiente pregunta");
    console.log($scope.buscarSigPregunta(14));

    console.log("Prueba anterior pregunta");
    console.log($scope.buscarAntPregunta(1));

    console.log("Prueba anterior pregunta");
    console.log($scope.buscarAntPregunta(14));

    /*Narrador*/

    /*Capturador de voz*/
  /*
    var recognition=new webkitSpeechRecognition();
    recognition.lang = "es-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    var final_transcript = '';

    recognition.onresult = function (event) {
      for(var k=0;k<event.results.length-1;k++){
        console.log(event.results[k][0].transcript);
        console.log("Estamos en envento hablar");
      }
    };
    recognition.start();
    recognition.stop();

    recognition.onstart = function(event) {

      console.log("On start");
    };
    recognition.onresult = function(event) {
      var interim_transcript = '';
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
      console.log(final_transcript);
    };
    */
    $rootScope.msg.text="Usted obtuvo un puntaje de "+correctAnswers +" sobre 5. Para iniciar la retroalimentación, presione control";
    $rootScope.synth.speak($rootScope.msg);
    instructionSpoken=true;
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

    });
  /*
    $document.bind("keyup",function(event){

      //espacio
      if(event.which==32){
        synth.cancel();
        var matchings=$scope.elementoFocus.match(/[p,r](\d*)/);
        var numero=Number(matchings[1]);
        if(document.getElementById("p"+numero)){
          $scope.pararHablarRespuesta(numero);
        }

      }
    });
    */
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
}
}]);
