class DieFace {
    constructor(face) {
        this.face = face;
        this.possibleOutcomes = {
        "BLANK":              {'s': 0, 'a': 0, 'f': 0, 't': 0, 'T': 0, 'D': 0},
        "SUCCESS":            {'s': 1, 'a': 0, 'f': 0, 't': 0, 'T': 0, 'D': 0},
        "ADVANTAGE":          {'s': 0, 'a': 1, 'f': 0, 't': 0, 'T': 0, 'D': 0},
        "SUCCESS ADVANTAGE":  {'s': 1, 'a': 1, 'f': 0, 't': 0, 'T': 0, 'D': 0},
        "DOUBLE SUCCESS":     {'s': 2, 'a': 0, 'f': 0, 't': 0, 'T': 0, 'D': 0},
        "DOUBLE ADVANTAGE":   {'s': 0, 'a': 2, 'f': 0, 't': 0, 'T': 0, 'D': 0},
        "TRIUMPH":            {'s': 1, 'a': 0, 'f': 0, 't': 0, 'T': 1, 'D': 0},
        "FAILURE":            {'s': 0, 'a': 0, 'f': 1, 't': 0, 'T': 0, 'D': 0},
        "THREAT":             {'s': 0, 'a': 0, 'f': 0, 't': 1, 'T': 0, 'D': 0},
        "FAILURE THREAT":     {'s': 0, 'a': 0, 'f': 1, 't': 1, 'T': 0, 'D': 0},
        "DOUBLE FAILURE":     {'s': 0, 'a': 0, 'f': 2, 't': 0, 'T': 0, 'D': 0},
        "DOUBLE THREAT":      {'s': 0, 'a': 0, 'f': 0, 't': 2, 'T': 0, 'D': 0},
        "DESPAIR":            {'s': 0, 'a': 0, 'f': 1, 't': 0, 'T': 0, 'D': 1},
        }
        this.value = this.possibleOutcomes[face.toUpperCase()];
    }
}