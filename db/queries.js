
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

const SELECT_TOURNAMENTS =
  'SELECT Tournament.id, Tournament.account_id, Tournament.name, Tournament.created, Tournament.active, COALESCE(json_agg(Obstacle) FILTER (WHERE Obstacle.id IS NOT NULL), \'[]\') AS obstacles ' +
  'FROM Tournament ' +
  'LEFT JOIN Obstacle ON Tournament.id = Obstacle.tournament_id ' +
  'GROUP BY Tournament.id'

const SELECT_ACCOUNT =
  'SELECT * ' +
  'FROM Account ' +
  'WHERE username = $1'

const SELECT_OBSTACLES =
  'SELECT * ' +
  'FROM Obstacle'

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

const INSERT_TOURNAMENT =
  'INSERT INTO Tournament(account_id, name, created, active) ' +
  'VALUES ($1, $2, $3, $4) ' +
  'RETURNING *'

const INSERT_ACCOUNT =
  'INSERT INTO Account (name, username, passwordHash) ' +
  'VALUES($1, $2, $3) ' +
  'RETURNING id, name, username'

const INSERT_OBSTACLE =
'INSERT INTO Obstacle(tournament_id, name) ' +
'VALUES ($1, $2) ' +
'RETURNING *'

const UPDATE_TOURNAMENT =
  'UPDATE Tournament ' +
  'SET active = $1 ' +
  'WHERE id = $2 ' +
  'RETURNING *'

module.exports = {
  SELECT_RESULTS,
  SELECT_PLAYERS,
  SELECT_TOURNAMENTS,
  SELECT_ACCOUNT,
  SELECT_OBSTACLES,
  INSERT_PLAYER,
  INSERT_RESULT,
  INSERT_OBSTACLERESULT,
  INSERT_TOURNAMENT,
  INSERT_OBSTACLE,
  UPDATE_TOURNAMENT,
  INSERT_ACCOUNT
}