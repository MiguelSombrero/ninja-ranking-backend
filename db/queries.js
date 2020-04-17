
const SELECT_RESULTS =
  'SELECT Result.id, Result.player_id, Result.time, array_remove(array_agg(ObstacleResult.obstacle_id), NULL) AS passed_obstacles ' +
  'FROM Result ' +
  'LEFT JOIN ObstacleResult ON Result.id = ObstacleResult.result_id ' +
  'GROUP BY Result.id'

const SELECT_PLAYERS =
  'SELECT Player.id, Player.nickname, Player.tournament_id, COALESCE(jsonb_agg(p) FILTER (WHERE p.id IS NOT NULL), \'[]\') AS results ' +
  `FROM (${SELECT_RESULTS}) AS p ` +
  'RIGHT JOIN Player ON Player.id = p.player_id ' +
  'GROUP BY Player.id'

const INSERT_PLAYER =
  'INSERT INTO Player(tournament_id, nickname) ' +
  'VALUES ($1, $2) ' +
  'RETURNING *'

const INSERT_RESULT =
  'INSERT INTO Result(player_id, time) ' +
  'VALUES ($1, $2) ' +
  'RETURNING *'

const INSERT_OBSTACLERESULT =
  'INSERT INTO ObstacleResult(result_id, obstacle_id) ' +
  'VALUES ($1, $2)'

module.exports = {
  SELECT_RESULTS,
  SELECT_PLAYERS,
  INSERT_PLAYER,
  INSERT_RESULT,
  INSERT_OBSTACLERESULT
}