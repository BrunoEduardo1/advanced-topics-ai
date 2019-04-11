var quantitatives = [
    ['age','0'],
    ['fnlwgt','2'],
    ['education-num','4'],
    ['capital-gain','10'],
    ['capital-loss','11'],
    ['hours-per-week','12']
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

$(document).ready(function() {
    let data = [];
    $.ajax({
    	type: "GET",
    	url: "dataset/adult.data.csv",
    	dataType: "text",
    	success: function(data) {
            data = $.csv.toArrays(data);
            processData(data);
            eachValue(data);
            console.table(data[0]);
        }
    });
});