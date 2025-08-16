import { supabase } from './supabaseClient';
import { TABLES, COLUMNS, APP } from './supabaseTables';

export async function createUser(username: string) {
  const { data, error } = await supabase
    .from(TABLES.USERS)
    .insert([{ username }])
    .select();
  if (error) throw error;
  return data?.[0];
}

export async function getUserByUsername(username: string) {
  const { data, error } = await supabase
    .from(TABLES.USERS)
    .select('*')
    .eq(COLUMNS.USERS.USERNAME, username);
  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}

export async function createGameRecord({
  player_id,
  game_id,
  score,
  achievement,
  game_duration,
  challenge_mode,
  player_level,
  game_settings,
}: {
  player_id: string;
  game_id: string;
  score: number;
  achievement: string;
  challenge_mode: string;
  game_duration: number;
  player_level: string;
  game_settings: any;
}) {
  const { data, error } = await supabase
    .from(TABLES.RECORDS)
    .insert([
      {
        player_id,
        game_id,
        score,
        achievement,
        game_duration,
        challenge_mode,
        player_level,
        game_settings,
      },
    ])
    .select();
  if (error) throw error;
  return data?.[0];
}
