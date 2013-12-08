var fetchPlayerData = function (leftPlayer, rightPlayer){
	var query = {
		left : leftPlayer,
		right : rightPlayer
	}


	$.ajax({

    url: document.URL+"/adraftstats?" +$.param(query),
    data: "",
    type: 'GET',
    crossDomain: true,
    dataType: 'json',
    success: function(results) {
			for (var i=0; i<data.length; i++) {
				data[i].barData1 = results.stats[i].barData1;
				data[i].barData2 = results.stats[i].barData2;
			}
			refresh(data);
		},
    error: function() { alert('Failed!'); },
    beforeSend: setHeader
});
};

var token = '';
function setHeader(xhr) {

  xhr.setRequestHeader('Authorization', token);
}

jQuery(window).load(function () {
	$("#leftSelect").change(function(){
		fetchPlayerData($("#leftSelect").find(":selected").text(),$("#rightSelect").find(":selected").text())
	});

	$("#rightSelect").change(function(){
		fetchPlayerData($("#leftSelect").find(":selected").text(),$("#rightSelect").find(":selected").text())
	});
	refresh(data);
});