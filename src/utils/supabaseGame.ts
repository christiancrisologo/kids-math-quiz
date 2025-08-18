import { supabase } from './supabaseClient';
import { TABLES, COLUMNS } from './supabaseTables';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function createUser(username: string) {
  console.log('[Supabase] createUser called with:', username);
  const { data, error } = await (supabase as SupabaseClient)
    .from(TABLES.USERS)
    .insert([{ username }])
    .select();
  if (error) {
    console.error('[Supabase] createUser error:', error);
    throw error;
  }
  console.log('[Supabase] createUser response:', data);
  return data?.[0];
}

export async function getUserByUsername(username: string) {
  console.log('[Supabase] getUserByUsername called with:', username);
  const { data, error } = await (supabase as SupabaseClient)
    .from(TABLES.USERS)
    .select('*')
    .eq(COLUMNS.USERS.USERNAME, username);
  if (error) {
    console.error('[Supabase] getUserByUsername error:', error);
    throw error;
  }
  console.log('[Supabase] getUserByUsername response:', data);
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
  game_settings: Record<string, unknown>;
}) {
  console.log('[Supabase] createGameRecord called with:', {
    player_id,
    game_id,
    score,
    achievement,
    game_duration,
    challenge_mode,
    player_level,
    game_settings,
  });
  const { data, error } = await (supabase as SupabaseClient)
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
  if (error) {
    console.error('[Supabase] createGameRecord error:', error);
    throw error;
  }
  console.log('[Supabase] createGameRecord response:', data);
  return data?.[0];
}
