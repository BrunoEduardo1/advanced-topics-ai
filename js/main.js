var quantitatives = [
    ['age','0'],
    ['fnlwgt','2'],
    ['education-num','4'],
    ['capital-gain','10'],
    ['capital-loss','11'],
    ['hours-per-week','12']
];

function eachValue(array) {
    let j = 0;
    do{
        let data = [];
        for (var i = array.length - 1; i >= 0; i--) {
            data.push(parseInt(array[i][quantitatives[j][1]]));
        }
        console.log("Median "+quantitatives[j][0]+": "+math.median(data));
        //console.log("Mean "+quantitatives[j][0]+": "+math.mean(data));
        j++;
    }while(quantitatives.length > j);
}

$(document).ready(function() {
    let data = [];
    $.ajax({
    	type: "GET",
    	url: "dataset/adult.datas.csv",
    	dataType: "text",
    	success: function(data) {
            data = $.csv.toArrays(data);
            eachValue(data);
            console.table(data[0]);
        }
    });
});