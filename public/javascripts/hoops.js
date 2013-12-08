var fetchPlayerData = function (leagueType,leftPlayer, rightPlayer){
	var query = {
		leagueType : leagueType,
		left : leftPlayer,
		right : rightPlayer
	};

	$.ajax({
    url: document.URL +"stats?" +$.param(query),
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

var updateLeague = function(leagueType){
	var query = {
		leagueType : leagueType,
	};

	$.ajax({
    url: document.URL +"league?" +$.param(query),
    data: "",
    type: 'GET',
    crossDomain: true,
    dataType: 'json',
    success: function(results) {

    	var leftSelect = $("#leftSelect").empty();
    	var rightSelect = $("#rightSelect").empty();

			$.each(results.players,function(){
				var leftOption = $("<option></option>").attr("value", this.player_id).text(this.player_name);
				var rightOption = $("<option></option>").attr("value", this.player_id).text(this.player_name);
				
				if(leftOption.val() == this.player_id)
					leftOption.attr("selected","true");

				if(rightOption.val() == this.player_id)
					rightOption.attr("selected","true");

				leftSelect.append(leftOption);
				rightSelect.append(rightOption);
			});		

			for (var i=0; i<data.length; i++) {
				data[i].barData1 = results.stats[i].barData1;
				data[i].barData2 = results.stats[i].barData2;
			}
			refresh(data);
		},
    error: function() { alert('Failed!'); },
    beforeSend: setHeader
	});
}

var token = '';
function setHeader(xhr) {
  xhr.setRequestHeader('Authorization', token);
}

jQuery(window).load(function () {
	$("#leagueSelect").change(function(){
		updateLeague($("#leagueSelect").find(":selected").val());
	});

	$("#leftSelect").change(function(){
		fetchPlayerData($("#leagueSelect").find(":selected").val(),$("#leftSelect").find(":selected").val(),$("#rightSelect").find(":selected").val());
	});

	$("#rightSelect").change(function(){
		fetchPlayerData($("#leagueSelect").find(":selected").val(),$("#leftSelect").find(":selected").val(),$("#rightSelect").find(":selected").val());
	});
	refresh(data);
});