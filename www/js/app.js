// Database instance.
var db = null;

// Include dependency: ngCordova
var starter = angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform, $cordovaSQLite) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
        //db = $cordovaSQLite.openDB({name: "my.db"});//mudar na hora de enviar celular
        db=window.openDatabase("nomeDoBancoDeDados4.db", "1.0", "Nome", 200000);
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS projetos (id INTEGER PRIMARY KEY, nome text, prioridade text, dataProjeto date)");

    });
})

starter.controller('DBController', function($scope, $cordovaSQLite) {
    $scope.resultado = "";
    $scope.peopleList = [];

    $scope.insert = function(nome, prioridade,dataProjeto) {

        $scope.peopleList = [];
        var query = "insert into projetos (nome, prioridade,dataProjeto) values (?,?,?)";

        $cordovaSQLite.execute(db,query,[nome, prioridade, dataProjeto]).then(function(result) {
            $scope.resultado = "Insert OK.";
        }, function(error){
            $scope.resultado = "Insert FAIL!";
        });
    }

    $scope.select = function(nome){
        $scope.peopleList = [];
        var query = "select nome, prioridade from projetos where nome = ?";
        $cordovaSQLite.execute(db,query,[nome]).then(function(result) {
            if(result.rows.length > 0){
                $scope.resultado = result.rows.item(0).nome + " foi encontrado";
            } else {
                $scope.resultado = "Não foi encontrado";
            }
        }, function(error){
            console.log(error);
        });
    }

    $scope.selectAll = function(){

        $scope.listaProjetos = [];
        var query = "select nome, prioridade, dataProjeto from projetos";
        $cordovaSQLite.execute(db,query,[]).then(function(result) {
            if(result.rows.length > 0){
                for(var i = 0; i < result.rows.length; i++) {
                    $scope.listaProjetos.push({nome: result.rows.item(i).nome, prioridade: result.rows.item(i).prioridade, dataProjeto: result.rows.item(i).dataProjeto});
                }
                $scope.resultado = result.rows.length + " rows found.";
            } else {
                $scope.resultado = "0 rows found!";
                $scope.listaProjetos = [];
            }
        }, function(error){
            console.log(error);
        });
        $scope.fsNome = "";
    }

    $scope.delete = function(nome) {
        $scope.listaProjetos = [];
        var query = "delete from projetos where nome = ?";
        $cordovaSQLite.execute(db,query,[nome]).then(function(result) {
            $scope.resultado = "Delete Ok.";
        }, function(error){
            $scope.resultado = "Delete FAIL!";
        });
    }

     $scope.update = function(nome, prioridade,dataProjeto) {//mudar essa funcao
        $scope.listaProjetos = [];
         console.log("Vou fazer update");
        var query = "update projetos set nome = ? where prioridade = ?";
        $cordovaSQLite.execute(db,query,[nome,prioridade]).then(function(result) {
            $scope.resultado = "Update OK.";
        }, function(error){
            $scope.resultado = "Update FAIL!";
        });
    }

    $scope.deleteAll = function() {
        $scope.listaProjetos = [];
        var query = "delete from projetos";
        $cordovaSQLite.execute(db,query,[]).then(function(result) {
            $scope.resultado = "Delete Ok.";
        }, function(error){
            $scope.resultado = "Delete FAIL!";
        });
    }

});
