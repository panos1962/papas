#include "papas.h"
#include <unistd.h>
#include <string.h>

static char *set_progname(int, char *[]);
static void usage(void);
static int a2ports(char *, int *);

void main(int argc, char *argv[]) {
	int opt;
	int uerrs = 0;
	int serrs = 0;
	int ports_from;
	int ports_to;
	int tries = 100000;
	int change = 0;

	progname = set_progname(argc, argv);
	while ((opt = getopt(argc, argv, ":cn:")) != -1) {
		switch (opt) {

		// Η option -c υποδηλώνει την αλλαγή πόρτας στην αρχική επιλογή του
		// παίκτη. Αυτό σημαίνει ότι αν υπάρχουν τρεις πόρτες A, B, C και ο
		// παίκτης είχε επιλέξει αρχικά την πόρτα B, τότε μετά το άνοιγμα
		// της πόρτας C από τον διαχειριστή, ο παίκτης θα πρέπει να επιλέξει
		// την πόρτα A.

		case 'c':
			change = 1;
			break;

		// Με την option -n καθορίζουμε το πλήθος των επαναλήψεων του πειράματος.
		// By default το πρόγραμμα κάνει 100000 επαναλήψεις.

		case 'n':
			if ((tries = atoi(optarg)) <= 0) {
				fprintf(stderr, "%s: %s: invalid tries\n", progname, optarg);
				serrs++;
			}
			break;

		case '?':
			uerrs++;
			break;
		}
	}

	argc -= optind;
	argv += optind;

	// Στο command line καθορίζουμε το πλήθος των πορτών, είτε ως ένα νούμερο
	// είτε ως εύρος δίνοντας δύο νούμερα. Αν π.χ. καθορίσουμε τον αριθμό 3,
	// τότε το πείραμα θα εκτελεστεί για 3 πόρτες, ενώ αν καθορίσουμε τους
	// αριθμούς 3 και 10, τότε το πείραμα θα εκτελεστεί για 3 πόρτες, κατόπιν
	// για 4 πόρτες κοκ μέχρι τις 10 πόρτες.

	switch (argc) {
	case 1:
		ports_from = (ports_to = a2ports(argv[0], &uerrs));
		break;
	case 2:
		ports_from = a2ports(argv[0], &uerrs);
		ports_to = a2ports(argv[1], &uerrs);
		break;
	default:
		uerrs++;
		break;
	}

	if (uerrs)
	usage();

	if (serrs)
	exit(EXIT_ERROR);

	papas(ports_from, ports_to, tries, change);
	exit(0);
}

static char *set_progname(int argc, char *argv[]) {
	char *p;

	if (argc <= 0)
	return "papas";

	if (!(p = strrchr(argv[0], '/')))
	return argv[0];

	return (argv[0] = p + 1);
}

static void usage(void) {
	fprintf(stderr, "usage: %s [-n tries] ports_from [ports_to]\n", progname);
	exit(EXIT_USAGE);
}

static int a2ports(char *s, int *errs) {
	int n;

	if ((n = atoi(s)) < 2) {
		fprintf(stderr, "%s: %s: invalid ports\n", progname, s);
		*errs++;
	}

	return n;
}
