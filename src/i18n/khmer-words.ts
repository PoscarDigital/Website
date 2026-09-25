/**
 * Khmer words that must not be split across lines.
 *
 * Khmer is written without spaces between words, so the browser finds line
 * breaks with its own dictionary. Chrome's dictionary splits many ordinary
 * words into their parts — ក្រុម|ហ៊ុន ("company"), ដំណោះ|ស្រាយ
 * ("solution"), គ្រប់|គ្រង ("manage") — so headings wrapped mid-word.
 * `src/middleware.ts` wraps each of these words in a nowrap span on /km/
 * pages, leaving the browser free to break only between whole words.
 *
 * This list was built from the site's own Khmer text: every word here
 * appears on the site and is split by Chrome's segmenter (checked with
 * Intl.Segmenter('km')). Add a word when you see it break mid-word; order
 * doesn't matter (longest match wins).
 */
export const khmerWords: readonly string[] = [
  // company / brand / place names
  'ផុស្ការ', 'ក្រុមហ៊ុន', 'ពេជ្រចិន្ដា', 'ស៊ីសុវត្ថិ', 'ជ្រោយចង្វារ', 'រាជធានី', 'កម្ពុជា',
  // management / operations
  'ការគ្រប់គ្រង', 'គ្រប់គ្រង', 'ដំណើរការ', 'ប្រតិបត្តិការ', 'សហប្រតិបត្តិការ',
  'កិច្ចសហប្រតិបត្តិការ', 'សហការគ្នា', 'សហការ', 'ដំណោះស្រាយ', 'ផ្លាស់ប្តូរ', 'ផ្លាស់ប្ដូរ', 'ទំនើបកម្ម',
  'ត្រួតពិនិត្យ', 'កាត់បន្ថយ', 'បច្ចុប្បន្នភាព', 'ហេដ្ឋារចនាសម្ព័ន្ធ', 'របាយការណ៍',
  'ប្រើប្រាស់', 'ដាក់ឱ្យប្រើប្រាស់', 'ងាយស្រួល', 'ឆាប់រហ័ស', 'ជាក់ស្តែង', 'ពេលវេលា',
  'គុណភាព', 'អត្ថប្រយោជន៍', 'នវានុវត្តន៍', 'លើកកម្ពស់', 'រួមចំណែក', 'ចូលរួម',
  'ត្រៀមខ្លួន', 'ផ្ទាល់ខ្លួន', 'ទាំងអស់', 'ទូទាំង', 'មួយចំនួន', 'ដំបូងគេ', 'ជាពិសេស',
  'ក្លាយជា', 'ជ្រុងជ្រោយ', 'មានបទពិសោធន៍', 'បទពិសោធន៍', 'ចាប់ដៃគ្នា', 'យោគយល់',
  'ទំនុកចិត្ត', 'ស្វែងយល់', 'ទំនាក់ទំនង', 'ពួកយើង', 'យើងខ្ញុំ', 'លោកអ្នក',
  // business / finance
  'អាជីវកម្ម', 'សហគ្រាស', 'ធុរកិច្ច', 'ហិរញ្ញវត្ថុ', 'សេវាកម្ម', 'ប្រាក់បៀវត្សរ៍',
  'ធនធានមនុស្ស', 'ក្រុមការងារ', 'សហស្ថាបនិក', 'អត្តសញ្ញាណ', 'វត្តមាន', 'ចុះឈ្មោះ',
  'ពាក្យស្នើសុំ', 'ក្នុងស្រុក', 'កាតឆ្លាតវៃ',
  // education
  'សាលារៀន', 'សាកលវិទ្យាល័យ', 'វិទ្យាស្ថាន', 'សាលាភូមិន្ទ', 'រដ្ឋបាល', 'ចូលរៀន',
  'ថ្នាក់ជាតិ', 'បណ្តុះបណ្តាល', 'វិជ្ជាជីវៈ', 'កាលវិភាគ', 'សិក្ខាសាលា', 'ចំណេះដឹង',
  'មាតាបិតា', 'អាណាព្យាបាល', 'គ្រូបង្រៀន', 'នាយកសាលា', 'កម្មវិធី', 'ព័ត៌មានវិទ្យា',
  'សេចក្តីជូនដំណឹង', 'គណៈកម្មាធិការ', 'លេខាធិការ', 'រដ្ឋមន្ត្រី',
  // site navigation / legal
  'ទំព័រដើម', 'គោលនយោបាយ', 'ឯកជនភាព', 'លក្ខខណ្ឌ', 'ចក្ខុវិស័យ',
];
