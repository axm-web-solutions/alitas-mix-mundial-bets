CREATE UNIQUE INDEX IF NOT EXISTS matches_unique_match ON public.matches (team_a, team_b, match_date);
