#include "papas.h"
#include <time.h>

// Το παρακάτω macro δίνει τυχαία τιμή στο διάστημα [0, ports)

#define random_choice(ports) (rand() * (double)ports / RAND_MAX)

static void experiment(int, int, int);
static int new_choice(int, int, int);

// Η function που ακολουθεί δέχεται μια γκάμα πλήθους πορτών, ένα πλήθος
// επαναλήψεων πειράματος και μια boolean που δείχνει αν ο παίκτης θα
// αλλάζει την αρχική του επιλογή ή όχι. Η function διατρέχει την γκάμα
// πλήθους πορτών και για κάθε πλήθος επαναλαμβάνει το πείραμα τόσες
// φορές όσες καθορίστηκαν μέσω της παραμέτρου των επαναλήψεων του
// πειράματος, τυπώνοντας στατιστικά αποτελέσματα για κάθε πλήθος πορτών.

void papas(int ports_from, int ports_to, int tries, int change) {
	int ports;
	int step;
	int i;

	srand(time(NULL) % 10000);

	// Το πείραμα διατρέχει τα πλήθη πορτών είτε από το μικρότερο
	// πλήθος προς το μεγαλύτερο, είτε αντίστροφα, ανάλογα με τη
	// σειρά που καθορίστηκαν τα συγκεκριμένα όρια.

	if (ports_from > ports_to) {
		i = ports_from - ports_to;
		step = -1;
	}
	else {
		i = ports_to - ports_from;
		step = 1;
	}

	for (ports = ports_from; i >= 0; i--, ports += step)
	experiment(ports, tries, change);
}

// Η function που ακολουθεί επαναλαμβάνει το πείραμα με βάση το πλήθος
// επαναλήψεων που έχει καθοριστεί, για συγκεκριμένο πλήθος πορτών και
// αλλάζοντας ή όχι την αρχική επιλογή του παίκτη ανάλογα με τη σχετική
// παράμετρο.

static void experiment(int ports, int tries, int change) {
	int target;
	int choice;
	int success;
	int i;

	for (success = 0, i = 0; i < tries; i++) {
		target = random_choice(ports);
		choice = random_choice(ports);

		if (change && (choice != target))
		success++;

		else if (target == choice)
		success++;
	}

	printf("%d %d %.0f%%\n", tries, success, 100.0 * success / tries);
}
