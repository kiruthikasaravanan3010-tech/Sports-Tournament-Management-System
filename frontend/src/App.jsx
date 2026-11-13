
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const API = 'http://localhost:8080/api';
const ANALYTICS_API = 'http://localhost:5001/api/analytics';

// Sports available in the database
const sports = [
  { sportId: 1, sportName: 'Football' },
  { sportId: 2, sportName: 'Volleyball' },
  { sportId: 3, sportName: 'Basketball' },
  { sportId: 4, sportName: 'Cricket' }
];

async function api(path, opts = {}) {
  const response = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Request failed');
  }

  return data;
}

const initialTeam = {
  teamName: '',
  departmentId: 1,
  sportId: 1
};

const initialPlayer = {
  playerName: '',
  teamId: 1,
  roleName: '',
  jerseyNumber: 1
};

const initialTour = {
  tournamentName: '',
  sportId: 1,
  startDate: '2026-11-15',
  endDate: '2026-11-20',
  formatName: 'LEAGUE'
};

const initialMatch = {
  tournamentId: 1,
  team1Id: 1,
  team2Id: 2,
  venueId: 1,
  matchDate: '2026-11-16',
  matchTime: '10:00',
  roundName: 'League Round',
  status: 'SCHEDULED'
};

export default function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('stmsUser') || 'null')
  );

  const [page, setPage] = useState('Dashboard');
  const [msg, setMsg] = useState('');

  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [matches, setMatches] = useState([]);
  const [standing, setStanding] = useState([]);

  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState('');

  const [login, setLogin] = useState({
    username: 'admin',
    password: 'admin123'
  });

  const [team, setTeam] = useState(initialTeam);
  const [player, setPlayer] = useState(initialPlayer);
  const [tour, setTour] = useState(initialTour);
  const [match, setMatch] = useState(initialMatch);

  const [score, setScore] = useState({
    matchId: '',
    team1Score: 0,
    team2Score: 0
  });

  const [tid, setTid] = useState('1');

  const [editing, setEditing] = useState({
    team: null,
    player: null,
    tournament: null,
    match: null
  });

  async function load() {
    try {
      const [a, b, c, d] = await Promise.all([
        api('/teams'),
        api('/players'),
        api('/tournaments'),
        api('/matches')
      ]);

      setTeams(a);
      setPlayers(b);
      setTournaments(c);
      setMatches(d);
    } catch (e) {
      setMsg(e.message);
    }
  }

  async function loadAnalytics() {
    setAnalyticsLoading(true);
    setAnalyticsError('');

    try {
      const response = await fetch(ANALYTICS_API);
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Analytics loading failed');
      }

      setAnalytics(data);
    } catch (e) {
      setAnalyticsError(
        e.message +
        '. Make sure Python Flask server is running on port 5001.'
      );
    } finally {
      setAnalyticsLoading(false);
    }
  }

  useEffect(() => {
    if (user) load();
  }, [user]);

  useEffect(() => {
    if (user && page === 'Analytics') {
      loadAnalytics();
    }
  }, [user, page]);

  async function act(fn, successMessage = 'Saved successfully') {
    setMsg('');

    try {
      await fn();
      await load();

      if (user) {
        await loadAnalytics();
      }

      setMsg(successMessage);
    } catch (e) {
      setMsg(e.message);
    }
  }

  function removeRecord(path, name) {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    act(
      () => api(path, { method: 'DELETE' }),
      `${name} deleted successfully`
    );
  }

  function editTeam(t) {
    setTeam({
      teamName: t.teamName || '',
      departmentId: t.departmentId ?? 1,
      sportId: t.sportId ?? 1
    });

    setEditing({ ...editing, team: t.teamId });
    setMsg('');
  }

  function editPlayer(p) {
    setPlayer({
      playerName: p.playerName || '',
      teamId: p.teamId ?? 1,
      roleName: p.roleName || '',
      jerseyNumber: p.jerseyNumber ?? 1
    });

    setEditing({ ...editing, player: p.playerId });
    setMsg('');
  }

  function editTournament(t) {
    setTour({
      tournamentName: t.tournamentName || '',
      sportId: t.sportId ?? 1,
      startDate: t.startDate || '',
      endDate: t.endDate || '',
      formatName: t.formatName || 'LEAGUE'
    });

    setEditing({ ...editing, tournament: t.tournamentId });
    setMsg('');
  }

  function editMatch(m) {
    setMatch({
      tournamentId: m.tournamentId ?? 1,
      team1Id: m.team1Id ?? 1,
      team2Id: m.team2Id ?? 2,
      venueId: m.venueId ?? 1,
      matchDate: m.matchDate || '',
      matchTime: m.matchTime ? String(m.matchTime).slice(0, 5) : '10:00',
      roundName: m.roundName || '',
      status: m.status || 'SCHEDULED'
    });

    setEditing({ ...editing, match: m.matchId });
    setMsg('');
  }

  function cancelEdit(type) {
    setEditing({ ...editing, [type]: null });

    if (type === 'team') setTeam(initialTeam);
    if (type === 'player') setPlayer(initialPlayer);
    if (type === 'tournament') setTour(initialTour);
    if (type === 'match') setMatch(initialMatch);

    setMsg('');
  }

  async function signIn(e) {
    e.preventDefault();

    await act(async () => {
      const x = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify(login)
      });

      localStorage.setItem('stmsUser', JSON.stringify(x));
      setUser(x);
    }, 'Login successful');
  }

  const field = (label, element) => (
    <label>
      {label}
      {element}
    </label>
  );

  if (!user) {
    return (
      <div className="login">
        <form onSubmit={signIn}>
          <div className="logo">🏆</div>
          <p className="tag">SPORTS DEPARTMENT</p>
          <h1>Sports Tournament<br />Management</h1>
          <p>Manage teams, fixtures, results and standings.</p>

          {field('Username',
            <input
              value={login.username}
              onChange={e =>
                setLogin({ ...login, username: e.target.value })
              }
            />
          )}

          {field('Password',
            <input
              type="password"
              value={login.password}
              onChange={e =>
                setLogin({ ...login, password: e.target.value })
              }
            />
          )}

          <button>Sign in</button>
          <small>Demo: admin / admin123</small>
          {msg}
        </form>
      </div>
    );
  }

  const nav = [
    'Dashboard',
    'Teams',
    'Players',
    'Tournaments',
    'Matches',
    'Standings',
    'Reports',
    'Analytics'
  ];

  const table = (heads, rows) => (
    <div className="scroll">
      <table>
        <thead>
          <tr>
            {heads.map(h => <th key={h}>{h}</th>)}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );

  const actionButtons = (onEdit, onDelete) => (
    <div style={{
      display: 'flex',
      gap: '7px',
      flexWrap: 'wrap'
    }}>
      <button
        type="button"
        onClick={onEdit}
        style={{
          background: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '7px',
          padding: '7px 12px',
          cursor: 'pointer'
        }}
      >
        Edit
      </button>

      <button
        type="button"
        onClick={onDelete}
        style={{
          background: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '7px',
          padding: '7px 12px',
          cursor: 'pointer'
        }}
      >
        Delete
      </button>
    </div>
  );

  // Analytics calculations
  const analyticsStandings = analytics?.standings || [];

  const totalWins = analyticsStandings.reduce(
    (sum, item) => sum + Number(item.won || 0), 0
  );

  const totalDraws = analyticsStandings.reduce(
    (sum, item) => sum + Number(item.drawn || 0), 0
  );

  const totalLosses = analyticsStandings.reduce(
    (sum, item) => sum + Number(item.lost || 0), 0
  );

  const teamPointsData = analyticsStandings
    .map(item => ({
      label: item.team_name,
      value: Number(item.points || 0)
    }))
    .filter(item => item.value > 0);

  const resultData = [
    { label: 'Won', value: totalWins },
    { label: 'Draw', value: totalDraws },
    { label: 'Lost', value: totalLosses }
  ].filter(item => item.value > 0);

  // Team Performance Bar Chart Data
  const scoreComparisonData = analyticsStandings.map(item => ({
    team: item.team_name,
    scoreFor: Number(item.score_for || 0),
    scoreAgainst: Number(item.score_against || 0)
  }));

  const pieLayout = {
    autosize: true,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: {
      color: '#334155',
      size: 13,
      family: 'Arial'
    },
    legend: {
      orientation: 'h',
      y: -0.12
    },
    margin: {
      l: 12,
      r: 12,
      t: 20,
      b: 35
    },
    showlegend: true
  };

  const pieConfig = {
    responsive: true,
    displayModeBar: false
  };

  const cardStyle = {
    background: '#ffffff',
    padding: '22px',
    borderRadius: '16px',
    boxShadow: '0 4px 18px rgba(15,23,42,0.06)',
    border: '1px solid #e2e8f0'
  };

  const chartStyle = {
    background: '#ffffff',
    borderRadius: '18px',
    padding: '18px',
    boxShadow: '0 4px 18px rgba(15,23,42,0.06)',
    border: '1px solid #e2e8f0',
    minWidth: 0
  };

  return (
    <div className="layout">
      <aside>
        <h2>🏆 STMS</h2>
        <small>Sports Management</small>

        {nav.map(n => (
          <button
            key={n}
            className={page === n ? 'sel' : ''}
            onClick={() => setPage(n)}
          >
            {n}
          </button>
        ))}

        <div className="bottom">
          {user.username}
          <small>{user.role}</small>

          <button onClick={() => {
            localStorage.removeItem('stmsUser');
            setUser(null);
            setPage('Dashboard');
            setAnalytics(null);
          }}>
            Sign out
          </button>
        </div>
      </aside>

      <main>
        <header>
          <div>
            <small>TOURNAMENT CONTROL CENTER</small>
            <h1>{page}</h1>
          </div>
          <b>{user.username}</b>
        </header>

        {msg && (
          <p className="msg" style={{
            padding: '10px 14px',
            borderRadius: '8px',
            background: msg.toLowerCase().includes('successfully')
              ? '#dcfce7'
              : '#fee2e2',
            color: msg.toLowerCase().includes('successfully')
              ? '#166534'
              : '#991b1b'
          }}>
            {msg}
          </p>
        )}

        {/* DASHBOARD */}
        {page === 'Dashboard' && (
          <>
            <div className="hero">
              <h2>Make every match count.</h2>
              <p>
                Manage your tournament from one simple workspace.
              </p>
            </div>

            <div className="cards">
              {[
                ['Teams', teams.length],
                ['Players', players.length],
                ['Tournaments', tournaments.length],
                ['Matches', matches.length]
              ].map(item => (
                <div key={item[0]}>
                  <small>{item[0]}</small>
                  <h2>{item[1]}</h2>
                </div>
              ))}
            </div>

            <section>
              <h3>Recent Fixtures</h3>
              {table(
                ['Match', 'Tournament', 'Teams', 'Date', 'Status'],
                matches.map(m => (
                  <tr key={m.matchId}>
                    <td>#{m.matchId}</td>
                    <td>{m.tournamentId}</td>
                    <td>{m.team1Id} vs {m.team2Id}</td>
                    <td>{m.matchDate}</td>
                    <td>{m.status}</td>
                  </tr>
                ))
              )}
            </section>
          </>
        )}

        {/* TEAMS */}
        {page === 'Teams' && (
          <div className="cols">
            <section>
              <h3>{editing.team ? 'Update Team' : 'Add Team'}</h3>

              <form onSubmit={e => {
                e.preventDefault();

                const isEditing = Boolean(editing.team);

                act(async () => {
                  await api(
                    isEditing ? `/teams/${editing.team}` : '/teams',
                    {
                      method: isEditing ? 'PUT' : 'POST',
                      body: JSON.stringify({
                        ...team,
                        departmentId: +team.departmentId,
                        sportId: +team.sportId
                      })
                    }
                  );

                  setTeam(initialTeam);
                  setEditing({ ...editing, team: null });
                }, isEditing ? 'Team updated successfully' : 'Team added successfully');
              }}>
                {field('Team name',
                  <input
                    required
                    value={team.teamName}
                    onChange={e =>
                      setTeam({ ...team, teamName: e.target.value })
                    }
                  />
                )}

                {field('Department ID',
                  <input
                    type="number"
                    value={team.departmentId}
                    onChange={e =>
                      setTeam({ ...team, departmentId: e.target.value })
                    }
                  />
                )}

                {field('Sport ID',
                  <input
                    type="number"
                    value={team.sportId}
                    onChange={e =>
                      setTeam({ ...team, sportId: e.target.value })
                    }
                  />
                )}

                <button>
                  {editing.team ? 'Update Team' : 'Add Team'}
                </button>

                {editing.team && (
                  <button
                    type="button"
                    onClick={() => cancelEdit('team')}
                    style={{ marginLeft: '8px' }}
                  >
                    Cancel
                  </button>
                )}
              </form>
            </section>

            <section>
              <h3>Team Directory</h3>
              {table(
                ['ID', 'Team', 'Dept', 'Sport', 'Actions'],
                teams.map(t => (
                  <tr key={t.teamId}>
                    <td>{t.teamId}</td>
                    <td>{t.teamName}</td>
                    <td>{t.departmentId}</td>
                    <td>{t.sportId}</td>
                    <td>
                      {actionButtons(
                        () => editTeam(t),
                        () => removeRecord(
                          `/teams/${t.teamId}`,
                          `Team ${t.teamName}`
                        )
                      )}
                    </td>
                  </tr>
                ))
              )}
            </section>
          </div>
        )}

        {/* PLAYERS */}
        {page === 'Players' && (
          <div className="cols">
            <section>
              <h3>{editing.player ? 'Update Player' : 'Register Player'}</h3>

              <form onSubmit={e => {
                e.preventDefault();

                const isEditing = Boolean(editing.player);

                act(async () => {
                  await api(
                    isEditing ? `/players/${editing.player}` : '/players',
                    {
                      method: isEditing ? 'PUT' : 'POST',
                      body: JSON.stringify({
                        ...player,
                        teamId: +player.teamId,
                        jerseyNumber: +player.jerseyNumber
                      })
                    }
                  );

                  setPlayer(initialPlayer);
                  setEditing({ ...editing, player: null });
                }, isEditing ? 'Player updated successfully' : 'Player registered successfully');
              }}>
                {field('Player name',
                  <input
                    required
                    value={player.playerName}
                    onChange={e =>
                      setPlayer({ ...player, playerName: e.target.value })
                    }
                  />
                )}

                {field('Team',
                  <select
                    value={player.teamId}
                    onChange={e =>
                      setPlayer({ ...player, teamId: e.target.value })
                    }
                  >
                    {teams.map(t => (
                      <option key={t.teamId} value={t.teamId}>
                        {t.teamName}
                      </option>
                    ))}
                  </select>
                )}

                {field('Position',
                  <input
                    value={player.roleName}
                    onChange={e =>
                      setPlayer({ ...player, roleName: e.target.value })
                    }
                  />
                )}

                {field('Jersey number',
                  <input
                    type="number"
                    value={player.jerseyNumber}
                    onChange={e =>
                      setPlayer({ ...player, jerseyNumber: e.target.value })
                    }
                  />
                )}

                <button>
                  {editing.player ? 'Update Player' : 'Register Player'}
                </button>

                {editing.player && (
                  <button
                    type="button"
                    onClick={() => cancelEdit('player')}
                    style={{ marginLeft: '8px' }}
                  >
                    Cancel
                  </button>
                )}
              </form>
            </section>

            <section>
              <h3>Players</h3>
              {table(
                ['ID', 'Name', 'Team', 'Position', 'Actions'],
                players.map(p => (
                  <tr key={p.playerId}>
                    <td>{p.playerId}</td>
                    <td>{p.playerName}</td>
                    <td>{p.teamId}</td>
                    <td>{p.roleName}</td>
                    <td>
                      {actionButtons(
                        () => editPlayer(p),
                        () => removeRecord(
                          `/players/${p.playerId}`,
                          `Player ${p.playerName}`
                        )
                      )}
                    </td>
                  </tr>
                ))
              )}
            </section>
          </div>
        )}

        {/* TOURNAMENTS */}
        {page === 'Tournaments' && (
          <div className="cols">
            <section>
              <h3>
                {editing.tournament ? 'Update Tournament' : 'Create Tournament'}
              </h3>

              <form onSubmit={e => {
                e.preventDefault();

                const isEditing = Boolean(editing.tournament);

                act(async () => {
                  await api(
                    isEditing
                      ? `/tournaments/${editing.tournament}`
                      : '/tournaments',
                    {
                      method: isEditing ? 'PUT' : 'POST',
                      body: JSON.stringify({
                        ...tour,
                        sportId: Number(tour.sportId)
                      })
                    }
                  );

                  setTour(initialTour);
                  setEditing({ ...editing, tournament: null });
                }, isEditing ? 'Tournament updated successfully' : 'Tournament created successfully');
              }}>
                {field('Tournament name',
                  <input
                    required
                    value={tour.tournamentName}
                    onChange={e =>
                      setTour({ ...tour, tournamentName: e.target.value })
                    }
                  />
                )}

                {field('Select Sport',
                  <select
                    required
                    value={tour.sportId}
                    onChange={e =>
                      setTour({ ...tour, sportId: Number(e.target.value) })
                    }
                  >
                    {sports.map(s => (
                      <option key={s.sportId} value={s.sportId}>
                        {s.sportName}
                      </option>
                    ))}
                  </select>
                )}

                {field('Start date',
                  <input
                    type="date"
                    required
                    value={tour.startDate}
                    onChange={e =>
                      setTour({ ...tour, startDate: e.target.value })
                    }
                  />
                )}

                {field('End date',
                  <input
                    type="date"
                    required
                    value={tour.endDate}
                    onChange={e =>
                      setTour({ ...tour, endDate: e.target.value })
                    }
                  />
                )}

                {field('Format',
                  <select
                    value={tour.formatName}
                    onChange={e =>
                      setTour({ ...tour, formatName: e.target.value })
                    }
                  >
                    <option value="LEAGUE">LEAGUE</option>
                    <option value="KNOCKOUT">KNOCKOUT</option>
                  </select>
                )}

                <button>
                  {editing.tournament ? 'Update Tournament' : 'Create Tournament'}
                </button>

                {editing.tournament && (
                  <button
                    type="button"
                    onClick={() => cancelEdit('tournament')}
                    style={{ marginLeft: '8px' }}
                  >
                    Cancel
                  </button>
                )}
              </form>
            </section>

            <section>
              <h3>Tournament List</h3>

              {tournaments.map(t => (
                <div className="item" key={t.tournamentId}>
                  <b>{t.tournamentName}</b>
                  <small>
                    {t.startDate} – {t.endDate} · {t.formatName}
                  </small>

                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: '10px'
                  }}>
                    {actionButtons(
                      () => editTournament(t),
                      () => removeRecord(
                        `/tournaments/${t.tournamentId}`,
                        `Tournament ${t.tournamentName}`
                      )
                    )}
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}

        {/* MATCHES */}
        {page === 'Matches' && (
          <div className="cols">
            <section>
              <h3>{editing.match ? 'Update Match' : 'Schedule Match'}</h3>

              <form onSubmit={e => {
                e.preventDefault();

                const isEditing = Boolean(editing.match);

                if (Number(match.team1Id) === Number(match.team2Id)) {
                  setMsg('Please select two different teams');
                  return;
                }

                act(async () => {
                  await api(
                    isEditing ? `/matches/${editing.match}` : '/matches',
                    {
                      method: isEditing ? 'PUT' : 'POST',
                      body: JSON.stringify({
                        ...match,
                        tournamentId: +match.tournamentId,
                        team1Id: +match.team1Id,
                        team2Id: +match.team2Id,
                        venueId: +match.venueId
                      })
                    }
                  );

                  setMatch(initialMatch);
                  setEditing({ ...editing, match: null });
                }, isEditing ? 'Match updated successfully' : 'Match scheduled successfully');
              }}>
                {field('Tournament',
                  <select
                    value={match.tournamentId}
                    onChange={e =>
                      setMatch({ ...match, tournamentId: e.target.value })
                    }
                  >
                    {tournaments.map(t => (
                      <option key={t.tournamentId} value={t.tournamentId}>
                        {t.tournamentName}
                      </option>
                    ))}
                  </select>
                )}

                {field('Team 1',
                  <select
                    value={match.team1Id}
                    onChange={e =>
                      setMatch({ ...match, team1Id: e.target.value })
                    }
                  >
                    {teams.map(t => (
                      <option key={t.teamId} value={t.teamId}>
                        {t.teamName}
                      </option>
                    ))}
                  </select>
                )}

                {field('Team 2',
                  <select
                    value={match.team2Id}
                    onChange={e =>
                      setMatch({ ...match, team2Id: e.target.value })
                    }
                  >
                    {teams.map(t => (
                      <option key={t.teamId} value={t.teamId}>
                        {t.teamName}
                      </option>
                    ))}
                  </select>
                )}

                {field('Venue ID',
                  <input
                    type="number"
                    value={match.venueId}
                    onChange={e =>
                      setMatch({ ...match, venueId: e.target.value })
                    }
                  />
                )}

                {field('Date',
                  <input
                    type="date"
                    value={match.matchDate}
                    onChange={e =>
                      setMatch({ ...match, matchDate: e.target.value })
                    }
                  />
                )}

                {field('Time',
                  <input
                    type="time"
                    value={match.matchTime}
                    onChange={e =>
                      setMatch({ ...match, matchTime: e.target.value })
                    }
                  />
                )}

                {field('Round',
                  <input
                    value={match.roundName}
                    onChange={e =>
                      setMatch({ ...match, roundName: e.target.value })
                    }
                  />
                )}

                <button>
                  {editing.match ? 'Update Match' : 'Schedule Match'}
                </button>

                {editing.match && (
                  <button
                    type="button"
                    onClick={() => cancelEdit('match')}
                    style={{ marginLeft: '8px' }}
                  >
                    Cancel
                  </button>
                )}
              </form>
            </section>

            <section>
              <h3>Fixtures</h3>

              {table(
                ['ID', 'Teams', 'Date', 'Status', 'Actions'],
                matches.map(m => (
                  <tr key={m.matchId}>
                    <td>{m.matchId}</td>
                    <td>{m.team1Id} vs {m.team2Id}</td>
                    <td>{m.matchDate}</td>
                    <td>{m.status}</td>
                    <td>
                      {actionButtons(
                        () => editMatch(m),
                        () => removeRecord(
                          `/matches/${m.matchId}`,
                          `Match #${m.matchId}`
                        )
                      )}
                    </td>
                  </tr>
                ))
              )}

              <hr />
              <h3>Record Result</h3>

              <form onSubmit={e => {
                e.preventDefault();

                act(() => api(`/matches/${score.matchId}/result`, {
                  method: 'POST',
                  body: JSON.stringify({
                    team1Score: +score.team1Score,
                    team2Score: +score.team2Score
                  })
                }), 'Match result saved successfully');
              }}>
                {field('Match',
                  <select
                    required
                    value={score.matchId}
                    onChange={e =>
                      setScore({ ...score, matchId: e.target.value })
                    }
                  >
                    <option value="">Select match</option>
                    {matches.map(m => (
                      <option key={m.matchId} value={m.matchId}>
                        #{m.matchId} · {m.team1Id} vs {m.team2Id}
                      </option>
                    ))}
                  </select>
                )}

                {field('Team 1 score',
                  <input
                    type="number"
                    min="0"
                    value={score.team1Score}
                    onChange={e =>
                      setScore({ ...score, team1Score: e.target.value })
                    }
                  />
                )}

                {field('Team 2 score',
                  <input
                    type="number"
                    min="0"
                    value={score.team2Score}
                    onChange={e =>
                      setScore({ ...score, team2Score: e.target.value })
                    }
                  />
                )}

                <button>Save Result</button>
              </form>
            </section>
          </div>
        )}

        {/* STANDINGS */}
        {page === 'Standings' && (
          <section>
            <h3>Points Table</h3>

            <div className="inline">
              <select
                value={tid}
                onChange={e => setTid(e.target.value)}
              >
                {tournaments.map(t => (
                  <option key={t.tournamentId} value={t.tournamentId}>
                    {t.tournamentName}
                  </option>
                ))}
              </select>

              <button onClick={() =>
                act(async () =>
                  setStanding(
                    await api('/standings?tournamentId=' + tid)
                  ), 'Standings loaded successfully')
              }>
                Load Standings
              </button>
            </div>

            {table(
              [
                'Rank', 'Team', 'P', 'W', 'D', 'L',
                'Score For', 'Score Against', 'Points'
              ],
              standing.map(s => (
                <tr key={s.teamId || s.rank}>
                  <td>{s.rank}</td>
                  <td>{s.teamName}</td>
                  <td>{s.played}</td>
                  <td>{s.won}</td>
                  <td>{s.drawn}</td>
                  <td>{s.lost}</td>
                  <td>{s.scoreFor}</td>
                  <td>{s.scoreAgainst}</td>
                  <td><b>{s.points}</b></td>
                </tr>
              ))
            )}
          </section>
        )}

        {/* REPORTS */}
        {page === 'Reports' && (
          <section>
            <h3>Match Report</h3>
            <p>
              Export fixture details as CSV or view the interactive
              analytics dashboard.
            </p>

            <button onClick={() => {
              const csv = [
                'Match ID,Tournament,Team 1,Team 2,Date,Time,Status',
                ...matches.map(m => [
                  m.matchId,
                  m.tournamentId,
                  m.team1Id,
                  m.team2Id,
                  m.matchDate,
                  m.matchTime,
                  m.status
                ].join(','))
              ].join('\n');

              const a = document.createElement('a');
              const url = URL.createObjectURL(
                new Blob([csv], { type: 'text/csv' })
              );

              a.href = url;
              a.download = 'match_report.csv';
              a.click();

              URL.revokeObjectURL(url);
            }}>
              Download Match CSV
            </button>
          </section>
        )}

        {/* ANALYTICS */}
        {page === 'Analytics' && (
          <div style={{
            background: '#f1f5f9',
            padding: '22px',
            borderRadius: '20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '15px',
              marginBottom: '25px'
            }}>
              <div>
                <h2 style={{
                  color: '#172554',
                  fontSize: '27px',
                  margin: 0
                }}>
                  Sports Analytics
                </h2>

                <p style={{ color: '#64748b' }}>
                  Tournament performance and statistics
                </p>
              </div>

              <button
                onClick={async () => {
                  await load();
                  await loadAnalytics();
                }}
                disabled={analyticsLoading}
                style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '11px',
                  padding: '12px 20px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {analyticsLoading ? 'Refreshing...' : '↻ Refresh Charts'}
              </button>
            </div>

            {analyticsLoading && (
              <p style={{ color: '#2563eb' }}>
                Loading latest analytics...
              </p>
            )}

            {analyticsError && (
              <div style={{
                background: '#fee2e2',
                color: '#991b1b',
                padding: '15px',
                borderRadius: '10px',
                marginBottom: '20px'
              }}>
                {analyticsError}
              </div>
            )}

            {analytics && !analyticsLoading && (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '16px',
                  marginBottom: '25px'
                }}>
                  {[
                    {
                      icon: '🏆',
                      label: 'Total Teams',
                      value: teams.length,
                      color: '#dbeafe'
                    },
                    {
                      icon: '👥',
                      label: 'Total Players',
                      value: players.length,
                      color: '#ede9fe'
                    },
                    {
                      icon: '📅',
                      label: 'Total Matches',
                      value: matches.length,
                      color: '#dcfce7'
                    },
                    {
                      icon: '🥇',
                      label: 'Total Wins',
                      value: totalWins,
                      color: '#ffedd5'
                    }
                  ].map(item => (
                    <div key={item.label} style={cardStyle}>
                      <div style={{
                        width: '46px',
                        height: '46px',
                        background: item.color,
                        borderRadius: '13px',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '23px'
                      }}>
                        {item.icon}
                      </div>

                      <p style={{
                        color: '#64748b',
                        marginBottom: '5px'
                      }}>
                        {item.label}
                      </p>

                      <h2 style={{
                        color: '#172554',
                        fontSize: '30px',
                        margin: 0
                      }}>
                        {item.value}
                      </h2>
                    </div>
                  ))}
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '20px'
                }}>
                  {/* TEAM POINTS PIE CHART */}
                  <section style={chartStyle}>
                    <h3 style={{ color: '#172554' }}>
                      🏆 Team Points Distribution
                    </h3>

                    <p style={{ color: '#64748b', fontSize: '13px' }}>
                      Points earned by each team
                    </p>

                    {teamPointsData.length > 0 ? (
                      <Plot
                        data={[{
                          type: 'pie',
                          labels: teamPointsData.map(x => x.label),
                          values: teamPointsData.map(x => x.value),
                          hole: 0.58,
                          textinfo: 'label+percent',
                          hoverinfo: 'label+value+percent',
                          sort: false,
                          marker: {
                            colors: [
                              '#2563eb', '#8b5cf6', '#06b6d4',
                              '#f59e0b', '#10b981', '#ef4444', '#ec4899'
                            ],
                            line: { color: '#ffffff', width: 3 }
                          }
                        }]}
                        layout={{
                          ...pieLayout,
                          annotations: [{
                            text: 'Points',
                            showarrow: false,
                            font: { size: 16, color: '#172554' }
                          }]
                        }}
                        config={pieConfig}
                        useResizeHandler
                        style={{ width: '100%', height: '330px' }}
                      />
                    ) : (
                      <p>No team points available yet.</p>
                    )}
                  </section>

                  {/* MATCH RESULTS PIE CHART */}
                  <section style={chartStyle}>
                    <h3 style={{ color: '#172554' }}>
                      📊 Match Results
                    </h3>

                    <p style={{ color: '#64748b', fontSize: '13px' }}>
                      Win, draw and loss distribution
                    </p>

                    {resultData.length > 0 ? (
                      <Plot
                        data={[{
                          type: 'pie',
                          labels: resultData.map(x => x.label),
                          values: resultData.map(x => x.value),
                          hole: 0.48,
                          textinfo: 'label+percent',
                          hoverinfo: 'label+value+percent',
                          marker: {
                            colors: ['#16a34a', '#f59e0b', '#ef4444'],
                            line: { color: '#ffffff', width: 3 }
                          }
                        }]}
                        layout={{
                          ...pieLayout,
                          annotations: [{
                            text: 'Results',
                            showarrow: false,
                            font: { size: 16, color: '#172554' }
                          }]
                        }}
                        config={pieConfig}
                        useResizeHandler
                        style={{ width: '100%', height: '330px' }}
                      />
                    ) : (
                      <p>No match results available yet.</p>
                    )}
                  </section>

                  {/* TEAM PERFORMANCE BAR CHART */}
                  <section style={{
                    ...chartStyle,
                    gridColumn: '1 / -1'
                  }}>
                    <h3 style={{ color: '#172554' }}>
                      📈 Team Performance Comparison
                    </h3>

                    <p style={{ color: '#64748b', fontSize: '13px' }}>
                      Compare total scores achieved and scores conceded by each team
                    </p>

                    {scoreComparisonData.length > 0 ? (
                      <Plot
                        data={[
                          {
                            type: 'bar',
                            name: 'Score For',
                            x: scoreComparisonData.map(x => x.team),
                            y: scoreComparisonData.map(x => x.scoreFor),
                            marker: {
                              color: '#3B82F6'
                            },
                            text: scoreComparisonData.map(x => x.scoreFor),
                            textposition: 'outside',
                            hovertemplate:
                              '<b>%{x}</b><br>Score For: %{y}<extra></extra>'
                          },
                          {
                            type: 'bar',
                            name: 'Score Against',
                            x: scoreComparisonData.map(x => x.team),
                            y: scoreComparisonData.map(x => x.scoreAgainst),
                            marker: {
                              color: '#F59E0B'
                            },
                            text: scoreComparisonData.map(x => x.scoreAgainst),
                            textposition: 'outside',
                            hovertemplate:
                              '<b>%{x}</b><br>Score Against: %{y}<extra></extra>'
                          }
                        ]}
                        layout={{
                          autosize: true,
                          barmode: 'group',
                          paper_bgcolor: 'rgba(0,0,0,0)',
                          plot_bgcolor: 'rgba(0,0,0,0)',
                          font: {
                            family: 'Arial',
                            color: '#334155',
                            size: 13
                          },
                          xaxis: {
                            title: 'Teams',
                            automargin: true
                          },
                          yaxis: {
                            title: 'Total Score',
                            rangemode: 'tozero'
                          },
                          legend: {
                            orientation: 'h',
                            y: -0.2
                          },
                          margin: {
                            l: 45,
                            r: 25,
                            t: 30,
                            b: 70
                          },
                          bargap: 0.3
                        }}
                        config={{
                          responsive: true,
                          displayModeBar: false
                        }}
                        useResizeHandler
                        style={{
                          width: '100%',
                          height: '380px'
                        }}
                      />
                    ) : (
                      <p>No completed match score data available yet.</p>
                    )}
                  </section>
                </div>

                {/* POINTS TABLE */}
                <section style={{
                  ...cardStyle,
                  marginTop: '25px',
                  overflow: 'hidden'
                }}>
                  <h3 style={{ color: '#172554' }}>
                    🏅 Tournament Points Table
                  </h3>

                  <p style={{ color: '#64748b' }}>
                    Current team performance and standings
                  </p>

                  {table(
                    [
                      'Team', 'Played', 'Won', 'Drawn',
                      'Lost', 'Score For', 'Score Against', 'Points'
                    ],
                    analyticsStandings.map(item => (
                      <tr key={item.team_id}>
                        <td><b>{item.team_name}</b></td>
                        <td>{item.played}</td>
                        <td>{item.won}</td>
                        <td>{item.drawn}</td>
                        <td>{item.lost}</td>
                        <td>{item.score_for}</td>
                        <td>{item.score_against}</td>
                        <td>
                          <b style={{ color: '#2563eb' }}>
                            {item.points}
                          </b>
                        </td>
                      </tr>
                    ))
                  )}
                </section>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
