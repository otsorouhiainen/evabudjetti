import i18next from 'i18next';

i18next.init({
    lng: 'fi',
    debug: true,
    resources: {
        en: {
            translation: {
                "Test string": "Test string",
                "Test string with interpolated value {{value}}": "Test string with interpolated value {{value}}"
            }
        },
        fi: {
            translation: {
                "Test string": "Testistringi",
                "Test string with interpolated value {{value}}": "Testistringi interpoloidulla arvolla {{value}}"
        }}
    }
})

/*  
/   Basic use example (when language is 'fi')
/   console.log(i18next.t("Test string")) <- This would print "Testistringi"
*/

/*  
/   Interpolation use example (when language is 'fi')
/   const testVariable = 5
/   console.log(i18next.t("Test string with interpolated value {{value}}", { value: testVariable } )) <- This would print "Testistringi interpoloidulla arvolla 5"
*/