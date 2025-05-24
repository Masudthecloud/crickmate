export function getManOfTheMatch(
  firstBattingStats,
  secondBattingStats,
  firstBowlingStats,
  secondBowlingStats,
  teamAPlayers,
  teamBPlayers
) {
  const allPerformers = [];

  const addStats = (batStats, bowlStats, players, team) => {
    batStats.forEach((batsman, i) => {
      const bowler = bowlStats[i] || {};
      const score =
        (batsman.runs || 0) +
        ((bowler.wickets || 0) * 25) -
        ((bowler.runsConceded || 0) / 10); // reward wickets, lightly penalize economy

      allPerformers.push({
        name: players[i],
        team,
        runs: batsman.runs || 0,
        wickets: bowler.wickets || 0,
        impactScore: score,
      });
    });
  };

  addStats(firstBattingStats, secondBowlingStats, teamAPlayers, "Team A");
  addStats(secondBattingStats, firstBowlingStats, teamBPlayers, "Team B");

  return allPerformers.sort((a, b) => b.impactScore - a.impactScore)[0];
}
