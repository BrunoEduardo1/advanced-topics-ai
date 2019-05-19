var quantitatives = [
    ['age','0'],
    ['fnlwgt','2'],
    ['education-num','4'],
    ['hours-per-week','10']
];
function filterOutliers(someArray) {  

    // Copy the values, rather than operating on references to existing values
    var values = someArray.concat();
    let q1,q2;

    // Then sort
    values.sort( function(a, b) {
            return a - b;
         });

    /* Then find a generous IQR. This is generous because if (values.length / 4) 
     * is not an int, then really you should average the two elements on either 
     * side to find q1.
     */
      if((values.length / 4) % 1 === 0){//find quartiles
        q1 = 1/2 * (values[(values.length / 4)] + values[(values.length / 4) + 1]);
        q3 = 1/2 * (values[(values.length * (3 / 4))] + values[(values.length * (3 / 4)) + 1]);
    } else {
        //q1 = values[Math.floor(values.length / 4 + 1)];
        q1 = values[Math.floor((values.length / 4))]; // is defined as the middle number between the smallest number and the median of the data set.
        //q3 = values[Math.ceil(values.length * (3 / 4) + 1)];
        q3 = values[Math.ceil((values.length * (3 / 4)))]; // is the middle value between the median and the highest value of the data set.
    }     
    // Likewise for q3. 
    var iqr = q3 - q1;
    console.log('q1: '+q1);
    console.log('q3: '+q3);

    // Then find min and max values
    var maxValue = q3 + iqr*1.5;
    var minValue = q1 - iqr*1.5;
    console.log('Max: '+maxValue);

    var filteredValues = values.filter(function(x) {
        return (x > maxValue) || (x < minValue);
    });

    // Then return
    return filteredValues;
}
function processData(data) {
    for (var i = 0; i < data.length; i++) {
        for (var property in data[i]) {
          if (data[i][property]== "?" || data[i][property]=== "" || data[i][property] < 0) {
            data.splice(i,1);
            i=0;
            break;
          }
        }
    }
}


function eachValue(array) {
    let j = 0;
    // let correlation = [];
    let  correlationMatrix = [];
    do{
        let data = [];
        // j % 2 ? null : correlation = [];     
        for (var i = array.length - 1; i >= 0; i--) {
            data.push(parseInt(array[i][quantitatives[j][1]]));
        }
            correlationMatrix[j] = data;
        try{
        let median ="Median: "+math.median(data)+" Standard deviation : "+math.std(data);
        graphs(data,quantitatives[j][0], median);
        //console.log("Outliers "+quantitatives[j][0]+": "+filterOutliers(data));
        // correlation.push(data);
        // j % 2 && console.log("Correlation: "+quantitatives[j-1][0]+" - "+quantitatives[j][0]+" = "+pearsonCorrelation(correlation,0,1));
        }catch(e){
            console.log(e);
        }
        j++;
    }while(quantitatives.length > j);
      correlogram(correlationMatrix);
      for (let x = 0; x < correlationMatrix.length; x++) {   
        for (let y = 0; y < correlationMatrix.length; y++) {   
            console.log("Correlation: "+quantitatives[x][0]+" - "+quantitatives[y][0]+" = "+pearsonCorrelation(correlationMatrix,x,y))
        }
      }
      /*Matrix({
        container : '#my_dataviz2',
        data      : correlationMatrix,
        labels    : labels,
        start_color : '#ffffff',
        end_color : '#3498db' 
    });*/
}

function chageNominaAttr(data) {
            
    let found = [],
        subti = [];
    /* Objeto com as colunas a serem substituídas
     * Percorre uma linha substituindo um atributo nominal pelo indice[número] atribuido a este
     * ex
        - goThroughColumns vai percorrer todas as colunas selecionando os valoeres distintos
          e salvando no em ojbt de acordo com sua propriedade sefinida em label (data[1] -> objt.workclass['State-gov'] )
        - workclass: data[1] vai receber  = objt['1'].indexOf('State-gov');
     */
    var objt = { 
        workclass:[],
        scolarShip:[],
        maritalStatus:[],
        occupation:[],
        relationship: [],
        race: [],
        sex: [],
        country: []

    };

    var label = { 
        '1': 'workclass',
        '3': 'scolarShip',
        '5': 'maritalStatus',
        '6': 'occupation',
        '7': 'relationship',
        '8': 'race',
        '9': 'sex',
        '11':'country'

    };

    //percorre cada coluna do array
    function goThroughColumns(element, index, array) {

        // console.log("a[" + index + "] = " + element);
        
        if (index != 0 && index != 2 && index != 4 && index != 10 && index != 12) {
            //Se o valor atual é distinto dos valores anteriores
            if (!objt[label[index]].find(item => item === element)) {
                
                found.push(element);

                objt[label[index]].push(element);
                
            }
            //Substituir o item em questão por um número
            array[index] = objt[label[index]].indexOf(element);

        }

    }
    //percorre cada linha do array
    function goThroughRows(element, index, array) {
        
        // console.log("a[" + index + "] = " + element);
        
        element.forEach(goThroughColumns);

    }

    data.forEach(goThroughRows);
    //console.log(objt);
    //console.log(found);

}

function newCsv(data) {
    
    // csvContent = "data:text/csv;charset=utf-8," + $.csv.fromArrays(data);
    let csvContent = $.csv.fromArrays(data);
    
    blob = new Blob([csvContent], {type: "text/csv"}); href = window.URL.createObjectURL(blob); 
    
    var link = document.createElement("a");
    
    link.setAttribute("href", href);
    
    link.setAttribute("download", "newData.csv");
    
    document.body.appendChild(link); // Required for FF

    link.click();

}

$(document).ready(function() {
    let data = [];
    $.ajax({
    	type: "GET",
    	url: "https://raw.githubusercontent.com/BrunoEduardo1/advanced-topics-ai/master/dataset/adult.data.csv",
    	dataType: "text",
    	success: function(data) {
            data = $.csv.toArrays(data);
            processData(data);
            chageNominaAttr(data);
            console.log(data);
            // newCsv(data);
            eachValue(data);
            // console.table(data[0]);
        }
    });
});