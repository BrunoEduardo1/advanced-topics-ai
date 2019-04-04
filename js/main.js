var quantitatives = [
    ['age','0'],
    ['fnlwgt','2'],
    ['education-num','4'],
    ['capital-gain','10'],
    ['capital-loss','11'],
    ['hours-per-week','12']
];

function median(values){
	if(values.length ===0) return 0;

	values.sort(function(a,b){
		return a-b;
	});

	var half = Math.floor(values.length / 2);

	if (values.length % 2)
		return values[half];

	return (values[half - 1] + values[half]) / 2.0;
}

function eachValue(array) {
    let j = 0;
    do{
        let data = [];
        for (var i = array.length - 1; i >= 0; i--) {
            data.push(parseInt(array[i][quantitatives[j][1]]));
        }
        console.log("Median "+quantitatives[j][0]+": "+median(data));
        j++;
    }while(quantitatives.length > j);
}

$(document).ready(function() {
    //Requisitar os dados
    console.log('uaaaai');
    let data = [];
    $.ajax({
    	type: "GET",
    	url: "dataset/adult.datas.csv",
    	dataType: "text",
    	success: function(data) {
            //Trasnformar csv em um array de objetos
            data = $.csv.toArrays(data);
            eachValue(data);
            console.table(data[0]);
            console.table(parseInt(data[0][0]));
        }
    });
});