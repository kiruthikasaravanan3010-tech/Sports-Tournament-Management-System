
package com.sports.stms;

import com.sports.stms.model.*;
import com.sports.stms.repo.*;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.beans.BeanUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
class ApiController {

    final TeamRepo teams;
    final PlayerRepo players;
    final TournamentRepo tournaments;
    final MatchRepo matches;
    final ResultRepo results;
    final UserRepo users;

    ApiController(
        TeamRepo t,
        PlayerRepo p,
        TournamentRepo tr,
        MatchRepo m,
        ResultRepo r,
        UserRepo u
    ) {
        teams = t;
        players = p;
        tournaments = tr;
        matches = m;
        results = r;
        users = u;
    }

    // HEALTH
    @GetMapping("/health")
    Map<String, String> health() {
        return Map.of("status", "UP");
    }

    // LOGIN
    @PostMapping("/auth/login")
    Map<String, String> login(@RequestBody Map<String, String> b) {

        AppUser u = users.findByUsername(b.get("username"))
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.UNAUTHORIZED, "Invalid login"
            ));

        if (!new BCryptPasswordEncoder().matches(
            b.getOrDefault("password", ""), u.passwordHash
        )) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED, "Invalid login"
            );
        }

        return Map.of(
            "username", u.username,
            "role", u.roleName
        );
    }

    // =====================================================
    // TEAMS - CREATE, READ, UPDATE, DELETE
    // =====================================================

    @GetMapping("/teams")
    List<Team> teams() {
        return teams.findAll();
    }

    @PostMapping("/teams")
    Team addTeam(@RequestBody Team x) {
        x.teamId = null;
        return teams.save(x);
    }

    @PutMapping("/teams/{id}")
    Team updateTeam(
        @PathVariable Long id,
        @RequestBody Team x
    ) {
        Team old = teams.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Team not found"
            ));

        BeanUtils.copyProperties(x, old, "teamId");

        return teams.save(old);
    }

    @DeleteMapping("/teams/{id}")
    @Transactional
    ResponseEntity<?> deleteTeam(@PathVariable Long id) {

        Team old = teams.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Team not found"
            ));

        try {
            teams.delete(old);
            teams.flush();

            return ResponseEntity.ok(
                Map.of("message", "Team deleted successfully")
            );

        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Cannot delete this team because it is used in other records"
            );
        }
    }

    // =====================================================
    // PLAYERS - CREATE, READ, UPDATE, DELETE
    // =====================================================

    @GetMapping("/players")
    List<Player> players() {
        return players.findAll();
    }

    @PostMapping("/players")
    Player addPlayer(@RequestBody Player x) {
        x.playerId = null;
        return players.save(x);
    }

    @PutMapping("/players/{id}")
    Player updatePlayer(
        @PathVariable Long id,
        @RequestBody Player x
    ) {
        Player old = players.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Player not found"
            ));

        BeanUtils.copyProperties(x, old, "playerId");

        return players.save(old);
    }

    @DeleteMapping("/players/{id}")
    @Transactional
    ResponseEntity<?> deletePlayer(@PathVariable Long id) {

        Player old = players.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Player not found"
            ));

        try {
            players.delete(old);
            players.flush();

            return ResponseEntity.ok(
                Map.of("message", "Player deleted successfully")
            );

        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Cannot delete this player because it is used in other records"
            );
        }
    }

    // =====================================================
    // TOURNAMENTS - CREATE, READ, UPDATE, DELETE
    // =====================================================

    @GetMapping("/tournaments")
    List<Tournament> tournaments() {
        return tournaments.findAll();
    }

    @PostMapping("/tournaments")
    Tournament addTournament(@RequestBody Tournament x) {
        x.tournamentId = null;
        return tournaments.save(x);
    }

    @PutMapping("/tournaments/{id}")
    Tournament updateTournament(
        @PathVariable Long id,
        @RequestBody Tournament x
    ) {
        Tournament old = tournaments.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Tournament not found"
            ));

        BeanUtils.copyProperties(x, old, "tournamentId");

        return tournaments.save(old);
    }

    @DeleteMapping("/tournaments/{id}")
    @Transactional
    ResponseEntity<?> deleteTournament(@PathVariable Long id) {

        Tournament old = tournaments.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Tournament not found"
            ));

        try {
            tournaments.delete(old);
            tournaments.flush();

            return ResponseEntity.ok(
                Map.of("message", "Tournament deleted successfully")
            );

        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Cannot delete this tournament because it has related matches or records"
            );
        }
    }

    // =====================================================
    // MATCH SCHEDULING VALIDATION
    // =====================================================

    private void validateMatch(GameMatch x, Long currentId) {

        if (x.team1Id == null || x.team2Id == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Select both teams"
            );
        }

        if (Objects.equals(x.team1Id, x.team2Id)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Select two different teams"
            );
        }

        if (x.matchDate == null || x.matchTime == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Match date and time are required"
            );
        }

        for (GameMatch m : matches.findAll()) {

            // Skip the current match during update
            if (currentId != null &&
                Objects.equals(m.matchId, currentId)) {
                continue;
            }

            if (
                Objects.equals(m.matchDate, x.matchDate) &&
                Objects.equals(m.matchTime, x.matchTime) &&
                !"CANCELLED".equals(m.status)
            ) {

                boolean sameTeam =
                    Objects.equals(m.team1Id, x.team1Id) ||
                    Objects.equals(m.team2Id, x.team1Id) ||
                    Objects.equals(m.team1Id, x.team2Id) ||
                    Objects.equals(m.team2Id, x.team2Id);

                if (sameTeam) {
                    throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Team already has a match in this time slot"
                    );
                }

                if (
                    x.venueId != null &&
                    Objects.equals(m.venueId, x.venueId)
                ) {
                    throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Venue already booked"
                    );
                }
            }
        }
    }

    // =====================================================
    // MATCHES - CREATE, READ, UPDATE, DELETE
    // =====================================================

    @GetMapping("/matches")
    List<GameMatch> matches() {
        return matches.findAll();
    }

    @PostMapping("/matches")
    GameMatch addMatch(@RequestBody GameMatch x) {

        validateMatch(x, null);

        x.matchId = null;

        return matches.save(x);
    }

    @PutMapping("/matches/{id}")
    @Transactional
    GameMatch updateMatch(
        @PathVariable Long id,
        @RequestBody GameMatch x
    ) {

        GameMatch old = matches.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Match not found"
            ));

        validateMatch(x, id);

        // Remove old result because match details are changing
        results.findByMatchId(id).ifPresent(results::delete);

        BeanUtils.copyProperties(x, old, "matchId");

        // Updated match must have its result recorded again
        old.status = "SCHEDULED";

        return matches.save(old);
    }

    @DeleteMapping("/matches/{id}")
    @Transactional
    ResponseEntity<?> deleteMatch(@PathVariable Long id) {

        GameMatch old = matches.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Match not found"
            ));

        try {
            // Delete corresponding result first
            results.findByMatchId(id).ifPresent(results::delete);

            // Delete match
            matches.delete(old);
            matches.flush();

            return ResponseEntity.ok(
                Map.of("message", "Match and its result deleted successfully")
            );

        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Cannot delete this match because it is referenced by other records"
            );
        }
    }

    // =====================================================
    // RECORD MATCH RESULT
    // =====================================================

    @PostMapping("/matches/{id}/result")
    @Transactional
    GameResult result(
        @PathVariable Long id,
        @RequestBody Map<String, Integer> b
    ) {

        GameMatch m = matches.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Match not found"
            ));

        int a = b.getOrDefault("team1Score", -1);
        int c = b.getOrDefault("team2Score", -1);

        if (a < 0 || c < 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Scores cannot be negative"
            );
        }

        GameResult r = results.findByMatchId(id)
            .orElse(new GameResult());

        r.matchId = id;
        r.team1Score = a;
        r.team2Score = c;

        r.winnerTeamId = a == c
            ? null
            : (a > c ? m.team1Id : m.team2Id);

        m.status = "COMPLETED";

        matches.save(m);

        return results.save(r);
    }

    // =====================================================
    // STANDINGS
    // =====================================================

    @GetMapping("/standings")
    List<Map<String, Object>> standings(
        @RequestParam Long tournamentId
    ) {

        Map<Long, Map<String, Object>> s = new HashMap<>();

        for (Team t : teams.findAll()) {

            Map<String, Object> r = new HashMap<>();

            r.put("teamId", t.teamId);
            r.put("teamName", t.teamName);

            for (String k : List.of(
                "played", "won", "drawn", "lost",
                "scoreFor", "scoreAgainst", "points"
            )) {
                r.put(k, 0);
            }

            s.put(t.teamId, r);
        }

        for (GameMatch m : matches.findAll()) {

            if (
                Objects.equals(m.tournamentId, tournamentId) &&
                "COMPLETED".equals(m.status)
            ) {

                GameResult r = results.findByMatchId(m.matchId)
                    .orElse(null);

                if (r == null) continue;

                Map<String, Object> a = s.get(m.team1Id);
                Map<String, Object> b = s.get(m.team2Id);

                if (a == null || b == null) continue;

                add(a, "played", 1);
                add(b, "played", 1);

                add(a, "scoreFor", r.team1Score);
                add(a, "scoreAgainst", r.team2Score);

                add(b, "scoreFor", r.team2Score);
                add(b, "scoreAgainst", r.team1Score);

                if (r.team1Score > r.team2Score) {

                    add(a, "won", 1);
                    add(a, "points", 3);
                    add(b, "lost", 1);

                } else if (r.team2Score > r.team1Score) {

                    add(b, "won", 1);
                    add(b, "points", 3);
                    add(a, "lost", 1);

                } else {

                    add(a, "drawn", 1);
                    add(b, "drawn", 1);
                    add(a, "points", 1);
                    add(b, "points", 1);
                }
            }
        }

        List<Map<String, Object>> out =
            new ArrayList<>(s.values());

        out.removeIf(x -> (int) x.get("played") == 0);

        out.sort((first, second) ->
            Integer.compare(
                (Integer) second.get("points"),
                (Integer) first.get("points")
            )
        );

        for (int i = 0; i < out.size(); i++) {

            Map<String, Object> x = out.get(i);

            x.put("rank", i + 1);

            x.put(
                "scoreDifference",
                (int) x.get("scoreFor") -
                (int) x.get("scoreAgainst")
            );
        }

        return out;
    }

    // STANDINGS HELPER
    void add(Map<String, Object> m, String k, int n) {
        m.put(k, (int) m.get(k) + n);
    }
}
