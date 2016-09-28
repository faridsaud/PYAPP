var app=angular.module("myApp",[]);
app.controller("Controlador",["$scope","$document","$http",function($scope,$document,$http){

  //Datos
  //Pregunta Opcion multiple
  var pregunta={
    texto:"Cuál de los siguientes colores no es un color primario",
    id:"akfhj",
    tipo:"opcionMultiple",
    respuestas:[
      {
        id:"10ao2",
        texto:"rojo",
        correcta:false,
        seleccionada:false
      },
      {
        id:"10ao4",
        texto:"negro",
        correcta:true,
        seleccionada:false
      },
      {
        id:"10ao21",
        texto:"amarillo",
        correcta:false,
        seleccionada:false
      },
      {
        id:"10ao211",
        texto:"azul",
        correcta:false,
        seleccionada:false
      },
    ]
  }
  var pregunta2={
    texto:"pregunta dos es la cosa bla bla",
    id:"akfhjd2",
    tipo:"opcionMultiple",
    respuestas:[
      {
        id:"10ao3",
        texto:"opcion 1",
        correcta:false,
        seleccionada:false
      },
      {
        id:"10ao33",
        texto:"opcion 2",
        correcta:true,
        seleccionada:false
      },
      {
        id:"10ao2133",
        texto:"opcion 3",
        correcta:false,
        seleccionada:false
      },
      {
        id:"10ao211333",
        texto:"opcion 4",
        correcta:false,
        seleccionada:false
      },
    ]
  }
  var pregunta3={
    texto:"1 + 1 es igual a 2",
    id:"akfhjd22",
    tipo:"verdaderoFalso",
    respuestas:[
      {
        id:"10ao2444",
        texto:"Verdadero",
        correcta:true,
        seleccionada:false
      },
      {
        id:"10ao44444",
        texto:"Falso",
        correcta:false,
        seleccionada:false
      },
    ]
  }
  var pregunta4={
    texto:"Nacemos, ______, morimos",
    id:"akfhjd222",
    tipo:"completar",
    respuestas:[
      {
        id:"10ao2511",
        texto:"crecemos",
        correcta:true,
        seleccionada:false
      },
      {
        id:"10ao4555",
        texto:"nada",
        correcta:false,
        seleccionada:false
      },
      {
        id:"10ao45555",
        texto:"volvemos a nacer",
        correcta:false,
        seleccionada:false
      },
      {
        id:"10ao4211",
        texto:"morimos",
        correcta:false,
        seleccionada:false
      },
    ]
  }
  $scope.preguntas=[
    pregunta, pregunta2, pregunta3, pregunta4
  ];
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
  var msg = new SpeechSynthesisUtterance();
  var synth = window.speechSynthesis;
  synth.onvoiceschanged = function() {
    voices = synth.getVoices();
    console.log(voices);
    msg.rate = 0.8;
    msg.voice = voices[6]; // Note: some voices don't support altering params
    msg.lang = 'es-US';

  }

  //Valores de angular
  //Eventos de presionar
  $document.bind("keydown",function(event){
    console.log(event);
    //CTRL
    if(event.which==17){
      synth.cancel();
      document.getElementById("p1").focus();
      $scope.elementoFocus="p1";
      $scope.ultimaPregunta="p1";

    }

    //numero es el valor del id
    //arriba
    if(event.which==38){
      synth.cancel();
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
      synth.cancel();
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
      synth.cancel();
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
      synth.cancel();
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
      synth.cancel();
      console.log("Evento: Espacio");
      console.log(event);
      var matchings=$scope.elementoFocus.match(/[p,r](\d*)/);
      var numero=Number(matchings[1]);
      if(numero==($scope.lastIndex+1)){
        $scope.guardarDatos();
        msg.text="Evaluación enviada con éxito";
        synth.speak(msg);
      }
      if(document.getElementById("r"+numero)){
        $scope.seleccionarRespuesta(numero);
        msg.text="Opción seleccionada con éxito";
        synth.speak(msg);
      }
      console.log("preguntas a enviar")
      console.log($scope.preguntas);


    }
  });

  //al hacer focus
  $document.bind("focusin",function(event){
    console.log("se hizo focus");
    console.log(event.target.id);
    $scope.elementoFocus=event.target.id;
    console.log(document.getElementById($scope.elementoFocus));
    speakP();

  });
  function speakP(){
    var textoP=document.getElementById($scope.elementoFocus).innerHTML;
    msg.text=textoP;
    synth.speak(msg);
    console.log(synth);
  }
}]);
