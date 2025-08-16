import { supabase } from './supabaseClient';

export async function createUser(username: string) {
  const { data, error } = await supabase
    .from('game_user')
    .insert([{ username }])
    .select();
  if (error) throw error;
  return data?.[0];
}

export async function getUserByUsername(username: string) {
  const { data, error } = await supabase
    .from('game_user')
    .select('*')
    .eq('username', username)
    .single();
  if (error) throw error;
  return data;
}

export async function createGameRecord({
  user_id,
  score,
  achievement,
  date_played,
  game_duration,
  player_level,
  game_settings,
}: {
  user_id: string;
  score: number;
  achievement: string;
  date_played: string;
  game_duration: number;
  player_level: string;
  game_settings: any;
}) {
  const { data, error } = await supabase
    .from('game_records')
    .insert([
      {
        user_id,
        score,
        achievement,
        date_played,
        game_duration,
        player_level,
        game_settings,
      },
    ])
    .select();
  if (error) throw error;
  return data?.[0];
}
