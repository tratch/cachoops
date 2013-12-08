SELECT 
S.player_id,
P.player_name,
avg(S.points) as points,
avg(S.assists) as assists,
avg(S.blocks) as blocks,
avg(S.rebounds) as rebounds,
avg(S.steals) as steals,
avg(S.ft) as freethrows,
avg(S.ftm) as freethrowsmade,
avg(S.tp_att) as threeattempts,
avg(S.tp_md) as threesmade
FROM hoops.stats S
join hoops.league L on S.league_id = L.league_id
join hoops.player P on S.player_id = P.player_id
where L.league_type = 34
group by S.player_id