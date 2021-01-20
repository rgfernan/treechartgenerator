'use strict';

// "Anonymous function" - Triggered on document ready of modal dialog.  Perform an initialize dialog, and then build the dialog
(function () {
    $(document).ready(function () {
        tableau.extensions.initializeDialogAsync().then(function (openPayload) {
            buildDialog();
        });

       
    });    

    // "buildDialog function" - Build the dropdown options based on what worksheets are available on the dashboard
    function buildDialog() {
        const dashboard = tableau.extensions.dashboardContent.dashboard;

        dashboard.worksheets.forEach(function (worksheet) {
            $("#selectWorksheet").append("<option value='" + worksheet.name + "'>" + worksheet.name + "</option>");
        });        

        var worksheetName = tableau.extensions.settings.get("selectWorksheet");
        if (worksheetName != undefined) {
            $("#selectWorksheet").val(worksheetName);
            columnsUpdate();
        }     

        $('#selectWorksheet').on('change', '', function () {
            columnsUpdate();
        });
        $('#cancel').click(closeDialog);
        $('#save').click(saveButton);

    }
	
    // "columnsUpdate function" - Build the dropdown options based on what columns are available on the dashboard
    function columnsUpdate() {
        var worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
        var worksheetName = $("#selectWorksheet").val();
        var worksheet = worksheets.find(function (sheet) {
            return sheet.name === worksheetName;
        });

        worksheet.getSummaryDataAsync().then(function (sumdata) {
            $("#selectCampo1").append("<option value='NA'>N/A</option>");
            $("#selectCampo2").append("<option value='NA'>N/A</option>");
            $("#selectCampo3").append("<option value='NA'>N/A</option>");
          
            sumdata.columns.forEach(function (current_value) {
                if (current_value.dataType != 'float' && current_value.dataType != 'int') {
                    $("#selectCampo1").append("<option value='" + current_value.fieldName + "'>" + current_value.fieldName + "</option>");
                    $("#selectCampo2").append("<option value='" + current_value.fieldName + "'>" + current_value.fieldName + "</option>");
                    $("#selectCampo3").append("<option value='" + current_value.fieldName + "'>" + current_value.fieldName + "</option>");
                   
                }
                if (current_value.dataType == 'float' || current_value.dataType == 'int') {
                    //$("#selectMeasure").append("<option value='" + current_value.fieldName + "'>" + current_value.fieldName + "</option>");
                }
            });
            //$("#selectDimension").prop("selectedIndex", 0).val();
            $("#selectCampo1").prop("selectedIndex", 0).val();
            $("#selectCampo2").prop("selectedIndex", 0).val();
            $("#selectCampo3").prop("selectedIndex", 0).val();
           // $("#Level4").prop("selectedIndex", 0).val();
           // $("#Level5").prop("selectedIndex", 0).val();
           // $("#selectMeasure").val(tableau.extensions.settings.get("MeasureChosenColumn"));
            //let j0 = tableau.extensions.settings.get("DimensionChosenColumn");
            //if (j0 != undefined) { $("#selectDimension").val(j0) };
            let j1 = tableau.extensions.settings.get("selectCampo1");
            if (j1 !== undefined) { $("#selectCampo1").val(j1) };
            let j2 = tableau.extensions.settings.get("selectCampo2");
            if (j2 !== undefined) { $("#selectCampo2").val(j2) };
            let j3 = tableau.extensions.settings.get("selectCampo3");
            if (j3 !== undefined) { $("#selectCampo3").val(j3) };
           
        });
    }

    //Close the dialog
    function closeDialog() {
        tableau.extensions.ui.closeDialog("10");
    }

    //Save the settings and close the dialog
    function saveButton() {       
     
            if ($("#selectWorksheet").val() == null || $("#selectCampo1").val() == null || $("#selectCampo2").val() == null || $("#selectCampo3").val() == null) {
                alert('Configuración inválida \n\Selecciona una hoja de trabajo y campos válidos.');
                return;
            }
            else {
                if ($("#selectCampo1").val() == 'NA' && $("#selectCampo2").val() == 'NA' && $("#selectCampo3").val() == 'NA') {
                    alert('Configuración inválida \n\nSelecciona al menos un campo.');
                    return;
                }
                else {
                    var l1 = $("#selectCampo1").val();
                    var l2 = $("#selectCampo2").val();
                    var l3 = $("#selectCampo3").val();
                    
                    if ((l1 == 'NA' && (l2 != 'NA' || l3 != 'NA')) || (l2 == 'NA' && (l3 != 'NA') )) {
                        alert('Configuración inválida \n\nCampos deben ser consecutivos.');
                        return;
                    }
                    if (l1 == 'NA' || l2 == 'NA' || l3 == 'NA') {
                        alert('Configuración inválida \n\nAl menos 3 campos obligatorios.');
                        return;
                    }
                    if (l1 == l2 || l1 == l3 || l2 == l3) {
                        alert('Configuración inválida \n\nNo se permiten campos duplicados.');
                        return;
                    }
                  
                }
            }              

        tableau.extensions.settings.set("selectWorksheet", $("#selectWorksheet").val());       
        tableau.extensions.settings.set("selectCampo1", $("#selectCampo1").val());
        tableau.extensions.settings.set("selectCampo2", $("#selectCampo2").val());
        tableau.extensions.settings.set("selectCampo3", $("#selectCampo3").val());       

        tableau.extensions.settings.saveAsync().then((currentSettings) => {
        tableau.extensions.ui.closeDialog("10");
        });
    }
})();