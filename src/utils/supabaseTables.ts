export const TABLES = {
  USERS: 'game_players',
  RECORDS: 'game_history',
  APPS: 'game_apps',
};

export const APP = {
  MATH_QUIZ: 'math_quiz',
  ID: '1a1e558c-2c2f-4dc0-9f92-991821a44e23'
};

export const COLUMNS = {
  USERS: {
    ID: 'id',
    USERNAME: 'username',
  },
  RECORDS: {
    ID: 'id',
    PLAYER_ID: 'player_id',
    SCORE: 'score',
    ACHIEVEMENT: 'achievement',
    GAME_DURATION: 'game_duration',
    PLAYER_LEVEL: 'player_level',
    GAME_SETTINGS: 'game_settings',
  },
  GAME_APPS: {
    ID: 'id',
    GAME_SETTINGS: 'game_settings',
  },
};
