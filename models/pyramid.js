var Pyramid = function(playerA, playerB) {
  return [
 					{"sharedLabel": "Points", "barData2": playerA.avg_points, "barData1": playerB.avg_points},
 					{"sharedLabel": "Assists", "barData2": playerA.avg_assists, "barData1": playerB.avg_assists},
 					{"sharedLabel": "Blocks", "barData2": playerA.avg_blocks, "barData1": playerB.avg_blocks},
 					{"sharedLabel": "D-Boards", "barData2": playerA.avg_drebs, "barData1": playerB.avg_drebs},
          {"sharedLabel": "O-Boards", "barData2": playerA.avg_orebs, "barData1": playerB.avg_orebs},
 					{"sharedLabel": "Steals", "barData2": playerA.avg_steals, "barData1": playerB.avg_steals},
 					{"sharedLabel": "FT Attempts", "barData2": playerA.avg_freethrowattempts, "barData1": playerB.avg_freethrowattempts},
 					{"sharedLabel": "FTs Made", "barData2": playerA.avg_freethrowsmade, "barData1": playerB.avg_freethrowsmade},
 					{"sharedLabel": "3pt Attempts", "barData2": playerA.avg_threeattempts, "barData1": playerB.avg_threeattempts},
 					{"sharedLabel": "3pt Made ", "barData2": playerA.avg_threesmade, "barData1": playerB.avg_threesmade},
          {"sharedLabel": "Player Rating", "barData2": playerA.playerrater, "barData1": playerB.playerrater}
 					]
};
module.exports = Pyramid;			