import i18next from 'i18next';

// biome-ignore format: <explanation> Ignore formatting to keep the required quotation marks
i18next.init({
	lng: 'fi',
	debug: true,
	resources: {
		en: {
			translation: {
				'Test string': 'Test string',
				'Test string with interpolated value {{value}}':
					'Test string with interpolated value {{value}}',

				//ADD_TRANSACTION
				'Income': 'Income',
				'Expense': 'Expense',
				'Benefit': 'Benefit',
				'Other': 'Other',
				'Rent': 'Rent',
				'Electricity': 'Electricity',
				'Water': 'Water',
				'Enter correct date in the format dd.mm.yyyy':
					'Enter correct date in the format dd.mm.yyyy',
				'Add new': 'Add new',
				'Category': 'Category',
				'Add category': 'Add category',
				'Enter category': 'Enter category',
				'Cancel': 'Cancel',
				'Save': 'Save',
				'{{transactionType}} name': '{{transactionType}} name',
				'Amount': 'Amount',
				'Date': 'Date',
				'Does the event repeat?': 'Does the event repeat?',
				'day intervals': 'day intervals',
				'monthly': 'monthly',
				'custom interval': 'custom interval',
				'Repeat interval': 'Repeat interval',
				'Additional information': 'Additional information',
				'Write additional information': 'Write additional information',
				'Enter a valid amount': 'Enter a valid amount',
				'Enter the recurrence interval':
					'Enter the recurrence interval',
				'{{transactionType}} added': '{{transactionType}} added',
				'Add {{transactionType}}': 'Add {{transactionType}}',
				'Saved': 'Saved',

				// BUDGET
				'Bus card': 'Bus card',
				'Study benefit': 'Study benefit',
				'Study loan': 'Study loan',
				'Pet': 'Pet',
				'Phone bill': 'Phone bill',
				'Invalid date, use format: dd.mm.yyyy':
					'Invalid date, use format: dd.mm.yyyy',
				'Day': 'Day',
				'Day view': 'Day view',
				'Month': 'Month',
				'Incomes': 'Incomes',
				'Expenses': 'Expenses',
				'Balance': 'Balance',
				'Available': 'Available',
				'Help Disposable income':
					'Disposable income refers to the amount of money left after your income and expenses. It helps you understand how much money you have available for other expenses or savings during the month.',
				'Close': 'Close',
				'Future events': 'Future events',
				'Edit Transaction': 'Edit Transaction',
				'Name': 'Name',
				'Amount (€)': 'Amount (€)',
				'dd.mm.yyyy': 'dd.mm.yyyy',
				'Year': 'Year',
				'Year view': 'Year view',

				// ERROR
				'Something went wrong': 'Something went wrong',
				'Back to home': 'Back to home',

				// SPENDING
				'Jacket': 'Jacket',
				'T-shirt': 'T-shirt',
				'Netflix': 'Netflix',
				'Gym Membership': 'Gym Membership',
				'Amusement Park': 'Amusement Park',
				'Café': 'Café',
				'Restaurants': 'Restaurants',
				'Hobbies': 'Hobbies',
				'Streaming Services': 'Streaming Services',
				'Clothing': 'Clothing',
				'Remaining': 'Remaining',
				'October 2025': 'Lokakuu 2025',
				'Usage of disposable income': 'Usage of disposable income',
				'Disposable income this month': 'Disposable income this month',
				'Spent so far': 'Spent so far',
				'Remaining disposable income': 'Remaining disposable income',
				'Past events': 'Past events',

				// LANDING
				'Help': 'Help',
				'Welcome to the budgeting app!':
					'Welcome to the budget app! Use the bottom navigation buttons to move between sections. Add an income or expense by pressing "Add income/expense". You can view and edit your budget and see a summary of your finances.',
				'CLOSE': 'CLOSE',
				'Supporting your financial well-being':
					'Supporting your financial well-being',
				'Money in account': 'Money in account',
				'Disposable income': 'Disposable income',
				'EXAMINE': 'EXAMINE',
				'ADD INCOME/EXPENSE': 'ADD INCOME/EXPENSE',
				'EDIT BUDGET': 'EDIT BUDGET',
				'SHOW BUDGET': 'SHOW BUDGET',
				'EVA Personal Budget': 'EVA Personal Budget',
				'VIEW DETAILS': 'VIEW DETAILS',
			},
		},
		fi: {
			translation: {
				'Test string': 'Testistringi',
				'Test string with interpolated value {{value}}':
					'Testistringi interpoloidulla arvolla {{value}}',

				//ADD_TRANSACTION
				'Income': 'Tulo',
				'Expense': 'Meno',
				'Benefit': 'Tuki',
				'Other': 'Muu',
				'Rent': 'Vuokra',
				'Electricity': 'Sähkö',
				'Water': 'Vesi',
				'Enter correct date in the format dd.mm.yyyy':
					'Anna oikea päivämäärä muodossa pp.kk.vvvv',
				'Add new': 'Lisää uusi',
				'Category': 'Kategoria',
				'Add category': 'Lisää kategoria',
				'Enter category': 'Kirjoita kategoria',
				'Cancel': 'Peruuta',
				'Save': 'Tallenna',
				'{{transactionType}} name': '{{transactionType}}n nimi',
				'Amount': 'Määrä',
				'Date': 'Päivämäärä',
				'Does the event repeat?': 'Toistuuko tapahtuma?',
				'day intervals': 'päivän välein',
				'monthly': 'kuukausittain',
				'custom interval': 'oma aikaväli',
				'Repeat interval': 'Toistuvuuden aikaväli',
				'Additional information': 'Lisätietoa',
				'Write additional information': 'Anna lisätietoa',
				'Enter a valid amount': 'Lisää määrä',
				'Enter the recurrence interval': 'Anna toistuvuuden aikaväli',
				'{{transactionType}} added': '{{transactionType}} lisätty',
				'Add {{transactionType}}': 'Lisää {{transactionType}}',
				'Saved': 'Tallennettu',

				// BUDGET
				'Bus card': 'Bussikortti',
				'Study benefit': 'Opintotuki',
				'Study loan': 'Opintolaina',
				'Pet': 'Lemmikki',
				'Phone bill': 'Puhelinlasku',
				'Invalid date, use format: dd.mm.yyyy':
					'Virheellinen päivämäärä, käytä muotoa: pp.kk.vvvv',
				'Day': 'Päivä',
				'Day view': 'Päivänäkymä',

				'Month': 'Kuukausi',
				'Months' : 'kuukaudet',

				"january": "tammikuu",
				"february": "helmikuu",
				"march": "maaliskuu",
				"april": "huhtikuu",
				"may": "toukokuu",
				"june": "kesäkuu",
				"july": "heinäkuu",
				"august": "elokuu",
				"september": "syyskuu",
				"october": "lokakuu",
				"november": "marraskuu",
				"december": "joulukuu",

				"Jan": "tammi",
				"Feb": "helmi",
				"Mar": "maalis",
				"Apr": "huhti",
				"May": "touko",   // to avoid collision with full "may"
				"Jun": "kesä",
				"Jul": "heinä",
				"Aug": "elo",
				"Sep": "syys",
				"Oct": "loka",
				"Nov": "marras",
				"Dec": "joulu",
				
				'Incomes': 'Tulot',
				'Expenses': 'Menot',
				'Balance': 'Tilillä rahaa',
				'Available': 'Käytettävissä',
				'Help': 'Ohjeet',
				'Instructions': 'Ohjeet',
				'Help Disposable income':
					'Käyttövara tarkoittaa rahamäärää, joka jää jäljelle tulojen ja menojen jälkeen. Se auttaa sinua ymmärtämään, kuinka paljon rahaa sinulla on käytettävissä muihin menoihin tai säästöihin kuukauden aikana.',
				'Close': 'Sulje',
				'CLOSE': 'SULJE',
				'SAVE': 'TALLENNA',
				'No transactions': 'Ei maksutapahtumia',
				'Account balance': 'Tilillä rahaa',
				'Future events': 'Tulevat tapahtumat',
				'Past events': 'Menneet tapahtumat',
				'Edit Transaction': 'Muokkaa tapahtumaa',
				'Name': 'Nimi',
				'Amount (€)': 'Määrä (€)',
				'dd.mm.yyyy': 'pp.kk.vvvv',
				'Year': 'Vuosi',
				'Year view': 'Vuosinäkymä',
				'No income records': 'Ei näytettäviä tuloja',
				'No expense records': 'Ei näytettäviä menoja',

				// ERROR
				'Something went wrong': 'Jokin meni pieleen',
				'Back to home': 'Palaa etusivulle',

				// SPENDING
				'Jacket': 'Takki',
				'T-shirt': 'T-paita',
				'Netflix': 'Netflix',
				'Gym Membership': 'Salijäsenyys',
				'Amusement Park': 'Huvipuisto',
				'Café': 'Kahvila',
				'Restaurants': 'Ravintolat',
				'Hobbies': 'Harrastukset',
				'Streaming Services': 'Suoratoistonpalvelut',
				'Clothing': 'Vaatteet',
				'October 2025': 'Lokakuu 2025',
				'Remaining': 'Jäljellä',
				'Usage of disposable income': 'Käyttörahan kulutus',
				'Disposable income this month': 'Kuukauden käyttövara',
				'Spent so far': 'Tähän mennessä käytetty',
				'Remaining disposable income': 'Jäljellä oleva käyttövara',

				// LANDING
				'Welcome to the budgeting app!':
					'Tervetuloa budjettisovellukseen! Käytä alaosan navigointipainikkeita siirtyäksesi osioiden välillä. Lisää tulo tai mepainamalla "Lisää tulo/meno". Voit tarkastella ja muokata budjettiasi sekä nähdä yhteenvedon taloudestasi.',
				'Supporting your financial well-being':
					'Taloudenhallintasi tueksi',
				'Money in account': 'Tilillä rahaa',
				'Disposable income': 'Käyttövara',
				'EXAMINE': 'TARKASTELE',
				'ADD INCOME/EXPENSE': 'LISÄÄ TULO/MENO',
				'EDIT BUDGET': 'MUOKKAA BUDJETTIA',
				'SHOW BUDGET': 'NÄYTÄ BUDJETTI',
				'EVA Personal Budget': 'EVA henkilökohtainen budjetti',
				'VIEW DETAILS': 'NÄYTÄ TIEDOT',
			},
		},
	},
});

/*  
/   Basic use example (when language is 'fi')
/   console.log(i18next.t('Test string')) <- This would print "Testistringi"
*/

/*  
/   Interpolation use example (when language is 'fi')
/   const testVariable = 5
/   console.log(i18next.t('Test string with interpolated value {{value}}', { value: testVariable })) <- This would print "Testistringi interpoloidulla arvolla 5"
*/
