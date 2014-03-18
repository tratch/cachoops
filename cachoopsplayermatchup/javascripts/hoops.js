data = [{
  "sharedLabel": "Points",
  "barData2": 0.0,
  "barData1": 0.0
}, {
  "sharedLabel": "Assists",
  "barData2": 0.0,
  "barData1": 0.0
}, {
  "sharedLabel": "Blocks",
  "barData2": 0.0,
  "barData1": 0.0
}, {
  "sharedLabel": "D-Boards",
  "barData2": 0.0,
  "barData1": 0.0
}, {
  "sharedLabel": "O-Boards",
  "barData2": 0.0,
  "barData1": 0.0
}, {
  "sharedLabel": "Steals",
  "barData2": 0.0,
  "barData1": 0.0
}, {
  "sharedLabel": "FT Attempts",
  "barData2": 0.0,
  "barData1": 0.0
}, {
  "sharedLabel": "FTs Made",
  "barData2": 0.0,
  "barData1": 0.0
}, {
  "sharedLabel": "3pt Attempts",
  "barData2": 0.0,
  "barData1": 0.0
}, {
  "sharedLabel": "3pt Made ",
  "barData2": 0.0,
  "barData1": 0.0
}, {
  "sharedLabel": "Player Rating",
  "barData2": 0.0,
  "barData1": 0.0
}];


var getLeftPlayerStats = function(leagueType, playerId) {
  var query = {
    playerid: playerId,
    leaguetype: leagueType
  };
  $.ajax({
    url: 'https://apitite.net/api/cachoops/matchupstats/json?' + $.param(query),
    data: "",
    type: 'GET',
    crossDomain: true,
    dataType: 'json',
    success: function(results) {
      data[0].barData2 = results[0].points;
      data[1].barData2 = results[0].assists;
      data[2].barData2 = results[0].blocks;
      data[3].barData2 = results[0].drebs;
      data[4].barData2 = results[0].orebs;
      data[5].barData2 = results[0].steals;
      data[6].barData2 = results[0].freethrows;
      data[7].barData2 = results[0].freethrowsmade;
      data[8].barData2 = results[0].threeattempts;
      data[9].barData2 = results[0].threesmade;
      data[10].barData2 = results[0].playerrater;
      refresh(data);
    },
    error: function() {
      alert('Failed!');
    },
    beforeSend: setHeader
  });
};



var getRightPlayerStats = function(leagueType, playerId) {
  var query = {
    playerid: playerId,
    leaguetype: leagueType
  };

  $.ajax({
    url: 'https://apitite.net/api/cachoops/matchupstats/json?' + $.param(query),
    data: "",
    type: 'GET',
    crossDomain: true,
    dataType: 'json',
    success: function(results) {
      data[0].barData1 = results[0].points;
      data[1].barData1 = results[0].assists;
      data[2].barData1 = results[0].blocks;
      data[3].barData1 = results[0].drebs;
      data[4].barData1 = results[0].orebs;
      data[5].barData1 = results[0].steals;
      data[6].barData1 = results[0].freethrows;
      data[7].barData1 = results[0].freethrowsmade;
      data[8].barData1 = results[0].threeattempts;
      data[9].barData1 = results[0].threesmade;
      data[10].barData1 = results[0].playerrater;
      refresh(data);
    },
    error: function() {
      alert('Failed!');
    },
    beforeSend: setHeader
  });
};
var updateLeague = function(loadPlayersCb) {
  var query = {
    leaguetype: $("#leagueSelect").find(":selected").val(),
  };

  $.ajax({
    url: 'https://apitite.net/api/cachoops/leagueplayers/json?' + $.param(query),
    data: "",
    type: 'GET',
    crossDomain: true,
    dataType: 'json',
    success: function(results) {
      var leftSelect = $("#leftSelect").empty();
      var rightSelect = $("#rightSelect").empty();

      $.each(results, function() {
        var leftOption = $("<option></option>").attr("value", this.player_id).text(this.player_name);
        var rightOption = $("<option></option>").attr("value", this.player_id).text(this.player_name);

        leftSelect.append(leftOption);
        rightSelect.append(rightOption);
      });
      loadPlayersCb($("#leagueSelect").find(":selected").val(), $("#leftSelect").find(":selected").val(), $("#rightSelect").find(":selected").val());
    },
    error: function() {
      alert('Failed!');
    },
    beforeSend: setHeader
  });
};



var token = '';

function setHeader(xhr) {
  xhr.setRequestHeader('Authorization', token);
}

jQuery(window).load(function() {

  var updateBothPlayers = function(leagueId, leftPlayerId, rightPlayerId) {

    getLeftPlayerStats(leagueId, leftPlayerId);
    getRightPlayerStats(leagueId, rightPlayerId);
  };

  $.ajax({
    url: 'https://apitite.net/api/cachoops/leagues/json',
    data: "",
    type: 'GET',
    crossDomain: true,
    dataType: 'json',
    success: function(leagues) {
      $.each(leagues, function() {
        $('#leagueSelect').append('<option value="' + this.type + '">' + this.league_name + '</option>');
      });
      updateLeague(updateBothPlayers);
    },
    error: function() {
      alert('Failed!');
    },
    beforeSend: setHeader
  });

  $("#leagueSelect").change(function() {
    updateLeague(updateBothPlayers);
  });
  $("#leftSelect").change(function() {
    getLeftPlayerStats($("#leagueSelect").find(":selected").val(), $("#leftSelect").find(":selected").val());
  });
  $("#rightSelect").change(function() {
    getRightPlayerStats($("#leagueSelect").find(":selected").val(), $("#rightSelect").find(":selected").val());
  });


  // refresh(data);
});