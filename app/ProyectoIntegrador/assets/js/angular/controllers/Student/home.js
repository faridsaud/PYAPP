app.controller('homeStudentController',['$scope','$http','$location','toastr','globalVariables','$rootScope','$state','$document',function($scope,$http,$location,toastr,globalVariables,$rootScope,$state,$document){
  if($rootScope.loggedUser){
    if($rootScope.loggedUser.role=="student"){

      $scope.numberOfTestsInExecution=0;
      $http({
        method:'POST',
        url:globalVariables.url+'/course/byStudent',
        data:{
          user:{
            email:$rootScope.loggedUser.email
          }
        }
      }).then(function success(response){
        console.log(response);
        $scope.courses=response.data.courses;
        console.log($scope.courses);
      }, function error(response){
        console.log(response);
      })


      $http({
        method:'POST',
        url:globalVariables.url+'/test/byStudent',
        data:{
          user:{
            email:$rootScope.loggedUser.email
          }
        }
      }).then(function success(response){
        console.log(response);
        $scope.tests=response.data.tests;
        $scope.numberOfTestsInExecution=$scope.countTestInExecution($scope.tests);
        console.log($scope.numberOfTestsInExecution);
        console.log($scope.tests);
      }, function error(response){
        console.log(response);
      })
      $scope.countTestInExecution=function(tests){
        var counter=0;
        for(var i=0;i<tests.length;i++){
          if(tests[i].status=='e'){
            counter++;
          }
        }
        return counter;
      }
      $scope.openCourse=function(courseName, courseId, courseDescription){
        console.log(courseDescription);
        $rootScope.activeCourse={};
        $rootScope.activeCourse.name=courseName;
        $rootScope.activeCourse.id=courseId;
        $rootScope.activeCourse.description=courseDescription;
        $location.path('/student/course/home');
      }

      $scope.openTest=function(testId){
        console.log("abreidno test"+testId);
        $rootScope.activeTest={};
        $rootScope.activeTest.id=testId;
        $state.go('studentTakeTest');
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
          $rootScope.msg.text="Bienvenido, presione control para escuchar las instrucciones";
        }
        $rootScope.synth.speak($rootScope.msg);
        instructionSpoken=true;
      }

      /*keypress events*/
      $document.unbind('keydown').bind("keydown",function(event){
        //  console.log(event);
        //CTRL
        if(event.which==17){
          $rootScope.synth.cancel();
          document.getElementById("p1").focus();
          $scope.focusedNumber=0;

        }

        //numero es el valor del id
        //arriba
        if(event.which==38){
          $rootScope.synth.cancel();
          var matchings=$scope.focusedElement.match(/[p,r](\d*)/);
          var number=Number(matchings[1]);
          if(number<=2){
            var newNumber=$scope.numberOfTestsInExecution+1;
            console.log("id to be foscused "+"r"+newNumber);

            $scope.focusedNumber=newNumber-1;
            document.getElementById("r"+newNumber).focus();
          }else{
            number=number-1;
            if(document.getElementById("r"+number)){
              console.log("id to be focused r"+number);
              $scope.focusedNumber=number-1;
              document.getElementById("r"+number).focus();
            }
          }

        }
        //abajo
        if(event.which==40){
          $rootScope.synth.cancel();
          var matchings=$scope.focusedElement.match(/[p,r](\d*)/);
          var number=Number(matchings[1]);
          if(number==$scope.numberOfTestsInExecution+1){
            console.log("id to be foscused r2");
            $scope.focusedNumber=1;
            document.getElementById("r2").focus();
          }else{
            number=number+1;
            if(document.getElementById("r"+number)){
              console.log("id to be focused r"+number);
              $scope.focusedNumber=number-1;
              document.getElementById("r"+number).focus();
            }
          }
        }

        //espacio
        if(event.which==32){
          $rootScope.synth.cancel();
          var matchings=$scope.focusedElement.match(/[p,r](\d*)/);
          var number=Number(matchings[1]);
          if(document.getElementById("r"+number)){
            var idTest=document.getElementById("r"+number).getAttribute("data-idTest");
            $scope.openTest(idTest);
          }

        }

        //+
        if(event.which==107){
          if($rootScope.msg){
            if($rootScope.msg.rate){
              if($rootScope.msg.rate<1.9){
                $rootScope.msg.rate=$rootScope.msg.rate+0.1;
                console.log($rootScope.msg.rate);
                $rootScope.synth.cancel();
                speakP();
              }
            }
          }
        }

        //-
        if(event.which==109){
          if($rootScope.msg){
            if($rootScope.msg.rate){
              if($rootScope.msg.rate>0.1){
                $rootScope.msg.rate=$rootScope.msg.rate-0.1;
                console.log($rootScope.msg.rate);
                $rootScope.synth.cancel();
                speakP();
              }
            }
          }
        }
      });
      //al hacer focus
      $document.unbind('focusin').bind("focusin",function(event){
        $scope.focusedElement=event.target.id;
        speakP();

      });
      function speakP(){
        $rootScope.synth.cancel();
        if($scope.focusedElement=='p1'){
          var textoP="Usted tiene "+$scope.numberOfTestsInExecution+" pruebas pendientes. Presione las teclas abajo o arriba para moverse entre las pruebas, y la tecla espacio para rendir dicha prueba";

        }else{
          console.log($scope.focusedNumber);
          var textoP="Prueba "+$scope.focusedNumber+ ". "+document.getElementById($scope.focusedElement).getElementsByTagName( 'td' )[0].textContent;
        }
        $rootScope.msg.text=textoP;
        $rootScope.synth.speak($rootScope.msg);
        console.log($rootScope.synth);
      }


    }else{
      $location.path('/home');
    }
  }else{
    $location.path('/home');
  }
}]);
