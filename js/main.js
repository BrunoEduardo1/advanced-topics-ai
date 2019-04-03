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
            console.table(data[0]);
            console.table(parseInt(data[0][0]));
        }
    });
});