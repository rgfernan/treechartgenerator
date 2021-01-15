function initUtilerias(){


$("a.diagrama").on("click", function () {
   
    //Reset Modal
    //resetModalFechaImp($("#modalFecImp"));
    //Llenar Modal
    var node = $(this).closest(".node");
    var normal = 1;
    if (normal > 0) {
        //fillModalFechaImp(tr);
        $("#modalDiagrama").modal({

        });
    }   
});
}