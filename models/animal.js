exports.registerAnimal = function (name, location){
    if(name == null || location == null){
        return false;
    }else{
        console.log("new Animal created()");
        return true;
    }
}