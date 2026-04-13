import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useLanguageStore } from '..//store/useLanguageStore';

const initialLanguage = useLanguageStore.getState().language;

// biome-ignore format: <explanation> Ignore formatting to keep the required quotation marks
i18next
.use(initReactI18next) //Connects i18Next to React
.init({
	lng: initialLanguage || 'fi',
	fallbackLng: 'fi',
	debug: true,
	resources: {
		en: {
			translation: {
				'Test string': 'Test string',
				'Test string with interpolated value {{value}}':
					'Test string with interpolated value {{value}}',

				//Layouts
				'Home': 'Home',
    			'Budget': 'Budget',
				'Funds': 'Funds',
    			'Summary': 'Summary',
				'Settings': 'Settings',

				//ADD_TRANSACTION
				'Select planned': 'Select planned',
				'Submit': 'Submit',
				'Add a real transaction': 'Add a real transaction',
				'Select a planned transaction': 'Select a planned transaction',
				'No upcoming planned transactions found.': 'No upcoming planned transactions found.',
				'Income name': 'Income name',
				'Expense name': 'Expense name',
				'Write the date here (DD-MM-YYYY)': 'Write the date here (DD-MM-YYYY)',

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

				//ADD NEW ITEM POPUP
				'Add a new item': 'Add a new item',
				'Write the name here': 'Write the name here',
				'Write the amount here (€)': 'Write the amount here (€)',
				'Reoccurrence': 'Does the item repeat?',
				'Rec_day': 'Day',
				'Rec_week': 'Week',
				'Rec_month': 'Month',
				'Rec_year': 'Year',
				'Interval': 'Interval',
				'Start Date': 'Start Date',
				'End Date': 'End Date',
				'Add': 'Add',

				// BUDGET
				'Previous': 'Previous',
				'Next': 'Next',
				'Finish': 'Finish',
				'No budget created': 'No budget created yet. Enter your balance in € without commas and press the "Create budget" button below to get started!',
				'Create budget': 'CREATE BUDGET',
				'Bus card': 'Bus card',
				'Study benefit': 'Study benefit',
				'Study loan': 'Study loan',
				'Pet': 'Pet',
				'Phone bill': 'Phone bill',
				'Invalid date, use format: dd.mm.yyyy':
					'Invalid date, use format: dd.mm.yyyy',
				'Day': 'Day',
				'Day view': 'Day view',
				'Week': 'Week',
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
				"january": "January",
				"february": "February",
				"march": "March",
				"april": "April",
				"may": "May",
				"june": "June",
				"july": "July",
				"august": "August",
				"september": "September",
				"october": "October",
				"november": "November",
				"december": "December",

				// FUNDS
				'Daily situation': 'Daily situation',
				'Account balance': 'Account balance',
				'Unknown': 'Unknown',
				'Disposable income': 'Disposable income',
				'Usable funds timeframe': 'Usable funds timeframe',
				'Load more': 'Load more',
				'No transactions': 'No transactions',

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
				'Current situation': 'Current situation',
				'Current balance': 'Current balance',
				'Usable funds': 'Usable funds',
				'/ day': '/ day',
				'Balance runs out': 'Balance runs out',
				'EXAMINE': 'EXAMINE',
				'ADD INCOME/EXPENSE': 'ADD INCOME/EXPENSE',
				'EDIT BUDGET': 'EDIT BUDGET',
				'SHOW BUDGET': 'SHOW BUDGET',
				'EVA MyBudget': 'EVA MyBudget',
				'EDIT BALANCE': 'EDIT BALANCE',

				// SUMMARY
				'Choose a year': 'Choose a year',
				'Months': 'Months',
				'No expenses this month': 'No expenses this month',
				'No income this month': 'No income this month',
				'Uncategorized': 'Uncategorized',

				// SETTINGS
				'Language': 'Language',
				'Timeframe': 'Timeframe',
				'Start date': 'Start date',
				'Timeframe length': 'Timeframe length',
				'days': 'days',
				'weeks': 'weeks',
				'months': 'months',
				'years': 'years'
			},
		},
		fi: {
			translation: {
				'Test string': 'Testistringi',
				'Test string with interpolated value {{value}}':
					'Testistringi interpoloidulla arvolla {{value}}',

				//Layouts
				'Home': 'Koti',
    			'Budget': 'Budjetti',
				'Funds': 'Käyttövara',
    			'Summary': 'Yhteenveto',
				'Settings': 'Asetukset',

				//ADD_TRANSACTION
				'Select planned': 'Valitse suunniteltu',
				'Submit': 'Tallenna',
				'Add a real transaction': 'Lisää tapahtuma',
				'Select a planned transaction': 'Valitse suunniteltu tapahtuma',
				'No upcoming planned transactions found.': 'Sinulla ei ole vielä budjetoituja menoja tai tuloja.',
				'Income name': 'Tulon nimi',
				'Expense name': 'Menon nimi',
				'Write the date here (DD-MM-YYYY)': 'Kirjoita päivämäärä tähän (PP-KK-VVVV)',

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
				
				//ADD NEW ITEM POPUP
				'Add a new item': 'Lisää uusi tapahtuma',
				'Write the name here': 'Kirjoita nimi tähän',
				'Write the amount here (€)': 'Kirjoita määrä tähän (€)',
				'Reoccurrence': 'Tapahtuma toistuu:',
				'Rec_day': 'päivän',
				'Rec_week': 'viikon',
				'Rec_month': 'kuukauden',
				'Rec_year': 'vuoden',
				'Custom': 'Muu',
				'Interval': 'välein',
				'Start Date': 'Tapahtuma alkaa',
				'End Date': 'Tapahtuma loppuu',
				'Add': 'Lisää',

				// BUDGET
				'Previous': 'Edellinen',
				'Next': 'Seuraava',
				'Finish': 'Valmis',
				'No budget created': 'Budjettia ei ole vielä luotu. Aloita syöttämällä tilisi saldo euroina (€) ilman pilkkuja ja paina alta löytyvää "Luo budjetti" -painiketta!',
				'Create budget': 'LUO BUDJETTI',
				'Bus card': 'Bussikortti',
				'Study benefit': 'Opintotuki',
				'Study loan': 'Opintolaina',
				'Pet': 'Lemmikki',
				'Phone bill': 'Puhelinlasku',
				'Invalid date, use format: dd.mm.yyyy':
					'Virheellinen päivämäärä, käytä muotoa: pp.kk.vvvv',
				'Day': 'Päivä',
				'Day view': 'Päivänäkymä',

				'Week': 'Viikko',
				'Month': 'Kuukausi',
				'Months' : 'kuukaudet',

				"january": "Tammikuu",
				"february": "Helmikuu",
				"march": "Maaliskuu",
				"april": "Huhtikuu",
				"may": "Toukokuu",
				"june": "Kesäkuu",
				"july": "Heinäkuu",
				"august": "Elokuu",
				"september": "Syyskuu",
				"october": "Lokakuu",
				"november": "Marraskuu",
				"december": "Joulukuu",

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

				// FUNDS
				'Daily situation': 'Päivän rahatilanne',
				'Account balance': 'Tilillä rahaa',
				'Unknown': 'Ei tietoa',
				'Disposable income': 'Käyttövara',
				'Usable funds timeframe': 'Käyttövarajakso',
				'Load more': 'Lataa enemmän',
				'No transactions': 'Ei maksutapahtumia',

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
				'Current situation': 'Nykytilanne',
				'Current balance': 'Nykyinen saldo',
				'Usable funds': 'Käyttövara',
				'Balance runs out': 'Saldo loppuu',
				'/ day': '/ vrk',
				'EXAMINE': 'TARKASTELE',
				'ADD INCOME/EXPENSE': 'LISÄÄ TULO/MENO',
				'EDIT BUDGET': 'MUOKKAA BUDJETTIA',
				'SHOW BUDGET': 'NÄYTÄ BUDJETTI',
				'EVA MyBudget': 'EVA OmaBudjetti',
				'EDIT BALANCE': 'MUOKKAA SALDOA',
				'Update Account Balance': 'Muokkaa Tilin Saldoa',
				'Current Planned Balance': 'Nykyinen Saldo',
				'New actual balance': 'Nykyinen korjattu saldo',
				'Difference': 'Muutos',
				'Are you sure?': 'Oletko varma?',
				'This will alter the balance record.': 'Tämä tulee muuttamaan tilin saldoa.',
				'Confirm': 'Vahvista',
				'Update balance': 'Muokkaa saldoa',

				// SUMMARY
				'Choose a year': 'Valitse vuosi',
				'Planned': 'Suunniteltu',
				'No expenses this month': 'Ei menoja tässä kuussa',
				'No income this month': 'Ei tuloja tässä kuussa',
				'Uncategorized': 'Ei määritelty',

				// SETTINGS
				'Language': 'Kieli',
				'Timeframe': 'Jakso',
				'Start date': 'Jakson alku',
				'Timeframe length': 'Jakson pituus',
				'days': 'päivää',
				'weeks': 'viikkoa',
				'months': 'kuukausia',
				'years': 'vuosia'
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
