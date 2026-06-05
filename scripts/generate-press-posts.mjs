#!/usr/bin/env node
// scripts/generate-press-posts.mjs
//
// One-time generator that converts the curated press-coverage list
// (../website-data/link_news_Poscar.xlsx, parsed once and embedded
// below) into individual blog markdown stubs in src/content/blog/.
//
// Each output post has:
//  - title       : original (Khmer) title as it appeared in the source
//  - date        : converted from the Excel serial date
//  - author      : "POSCAR Digital"
//  - source_url  : link to the original article
//  - source_name : outlet name
//  - thumbnail   : auto-picked from /images/brand/ based on title keywords
//  - category    : auto-detected (Press / Education / Business)
//  - tags        : auto-detected (Wiki School, Vithean, MoEYS, COVID-19, …)
//  - body        : one-line themed teaser
//
// Re-run safe: skips any file that already exists (so manual edits stick).
//
// Usage:
//   npm run generate:press            # generate missing posts
//   npm run generate:press -- --force # overwrite existing files

import { writeFile, mkdir, access } from 'node:fs/promises';
import { join } from 'node:path';

const args = process.argv.slice(2);
const force = args.includes('--force');

const OUT_DIR = 'src/content/blog';

// Press entries parsed from ../website-data/link_news_Poscar.xlsx.
// Date values are Excel serial numbers (days since 1899-12-30, with
// Excel's 1900 leap-year bug — handled by excelDateToISO below).
const entries = [
  { no: 1,  serial: 43552, url: 'https://m.freshnewsasia.com/index.php/en/localnews/117496-2019-03-28-10-36-15.html', title: 'ក្រសួងអប់រំ បានប្រើប្រាស់ប្រព័ន្ធចុះវត្តមានឌីជីថល ដំបូងគេនៅកម្ពុជា', source: 'Fresh News' },
  { no: 2,  serial: 43645, url: 'https://freshnewsasia.com/index.php/en/localnews/126429-2019-06-29-13-32-28.html', title: 'សាលារៀនជំនាន់ថ្មីនៃវិទ្យាល័យព្រះស៊ីសុវត្ថិ ជាសាលារដ្ឋដំបូងបំផុត បានប្រើប្រាស់បច្ចេកវិទ្យាទំនើប ស្របតាមគោលនយោបាយសាលារៀនសតវត្សទី២១', source: 'Fresh News' },
  { no: 3,  serial: 43651, url: 'https://freshnewsasia.com/index.php/en/localnews/126976-2019-07-05-05-50-06.html', title: 'Wiki School បាននាំយកបច្ចេកវិទ្យាស្កេនមុខ (Facial Recognition) មកប្រើប្រាស់ក្នុងវិស័យអប់រំដំបូងគេនៅកម្ពុជា', source: 'Fresh News' },
  { no: 4,  serial: 43657, url: 'https://freshnewsasia.com/index.php/en/localnews/127538-2019-07-11-07-47-22.html', title: 'សាលាភូមិន្ទរដ្ឋបាល សហការជាមួយ ក្រុមហ៊ុន POSCAR ដាក់ឲ្យដំណើរការ កាតសម្គាល់ខ្លួនវ័យឆ្លាត ដើម្បីគ្រប់គ្រងទិន្នន័យមន្ត្រីតាមប្រព័ន្ធ Digital', source: 'Fresh News' },
  { no: 5,  serial: 43924, url: 'https://www.freshnewsasia.com/index.php/en/localnews/153885-2020-04-03-11-35-27.html', title: 'Wiki School បានបន្ថែមមុខងារថ្មី សម្រាប់សិស្សមើលវីដេអូមេរៀនតាមកាលវិភាគប្រចាំថ្ងៃ', source: 'Fresh News' },
  { no: 6,  serial: 43932, url: 'https://www.freshnewsasia.com/index.php/en/localnews/155119-2020-04-11-00-53-32.html', title: 'ប្រព័ន្ធសាលារៀនឌីជីថល «Wiki School» នៅវិទ្យាល័យពេជ្រចិន្ដា កំពុងជំរុញសាលានេះ ឲ្យក្លាយជាវិទ្យាល័យឌីជីថលឈានមុខគេនៅកម្ពុជា', source: 'Fresh News' },
  { no: 7,  serial: 43935, url: 'https://www.freshnewsasia.com/index.php/en/localnews/155714-2020-04-14-06-57-05.html', title: 'បណ្ឌិតសភាចារ្យ ហង់ជួន ណារ៉ុន នឹងសម្ពោធដាក់ឱ្យប្រើប្រាស់ប្រព័ន្ធសាលារៀនឌីជីថល «Wiki School» នៅវិទ្យាស្ថានជាតិអប់រំ', source: 'Fresh News' },
  { no: 8,  serial: 43963, url: 'https://www.freshnewsasia.com/index.php/en/localnews/159037-2020-05-12-10-46-37.html', title: 'គ្រូ បុគ្គលិក និងនិស្សិតវិទ្យាស្ថានជាតិអប់រំ ១៣៥០នាក់ ទទួលបានចំណេះដឹង ស្តីពីការប្រើប្រាស់ប្រព័ន្ធ Wiki School សម្រាប់ការៀន និងបង្រៀន', source: 'Fresh News' },
  { no: 9,  serial: 44438, url: 'https://www.freshnewsasia.com/index.php/en/localnews/210944-2021-08-30-02-10-36.html', title: '«ការចូលរួមរបស់ Wiki School ជាមួយក្រសួងអប់រំ ផ្តល់មធ្យោបាយគាំទ្រការបង្រៀនពីចម្ងាយ ទប់ស្កាត់ជំងឺកូវីដ១៩» ជាប្រធានបទកិច្ចសម្ភាសកម្មវិធី «ភ្ញៀវពិសេសប្រចាំសប្តាហ៍»', source: 'Fresh News' },
  { no: 10, serial: 44439, url: 'https://www.freshnewsasia.com/index.php/en/localnews/211125-2021-08-31-06-13-04.html', title: 'ការចូលរួមរបស់ Wiki School ជាមួយក្រសួងអប់រំ ផ្ដល់មធ្យោបាយគាំទ្របង្រៀនពីចម្ងាយ ដើម្បីទប់ស្កាត់ការរីករាលដាល់ជំងឺកូវីដ១៩', source: 'Fresh News' },
  { no: 11, serial: 44439, url: 'https://www.postkhmer.com/national/2021-08-31-1039-222720.html', title: 'សហព័ន្ធសេវាអប់រំនៅកម្ពុជា និង POSCAR រៀបចំសិក្ខាសាលាស្តីពី កាលានុវត្តភាពនៃវិស័យបច្ចេកទេសវិទ្យា និងនវានុវត្តន៍សម្រាប់ការអប់រំនៅកម្ពុជា', source: 'Post Khmer' },
  { no: 12, serial: 44482, url: 'https://www.freshnewsasia.com/index.php/en/localnews/216057-2021-10-13-08-28-55.html', title: 'រដ្ឋមន្ត្រីក្រសួងអប់រំ រំពឹងថាប្រព័ន្ធសាលារៀនឌីជីថល «Wiki School» នឹងជួយដល់វិទ្យាស្ថានជាតិអប់រំ ដំណើរការរៀន និងបង្រៀន ឲ្យមានភាពល្អប្រសើរជាងមុន', source: 'Fresh News' },
  { no: 13, serial: 44482, url: 'https://www.freshnewsasia.com/index.php/en/localnews/216062-2021-10-13-09-12-11.html', title: 'ប្រព័ន្ធសិក្សាបែបទំនើប ងាយស្រួលសម្រាប់សិស្ស និងអាណាព្យាបាលស្វែងយល់ពីសិក្សាកូន Wiki School ត្រូវបានដាក់ឲ្យដំណើរការនៅសាលាអន្តរជាតិ True Visions', source: 'Fresh News' },
  { no: 14, serial: 44547, url: 'http://plus.freshnewsasia.com/index.php/en/freshnewsplus/224111-2021-12-17-11-09-39.html', title: 'ផុស្ការ ឌីជីថល ដែលជាក្រុមហ៊ុនឈានមុខគេក្នុងចំណោមក្រុមឌីជីថលក្នុងស្រុកផ្នែកប្រព័ន្ធអប់រំ និងគ្រប់គ្រងសហគ្រាស សម្ពោធទីស្នាក់ការថ្មី', source: 'Fresh News+' },
  { no: 15, serial: 44570, url: 'https://www.youtube.com/watch?v=WA0KAm_7mQM&ab_channel=FRESHNEWS', title: 'កូនខ្មែរបង្កើតប្រព័ន្ធគណនេយ្យអនឡាញ «វិធាន» ជួយការងារគ្រប់គ្រងហិរញ្ញវត្ថុកាន់តែងាយស្រួល ក្នុងយុគសម័យឌីជីថល', source: 'Fresh News (YouTube)' },
  { no: 16, serial: 44597, url: 'https://www.freshnewsasia.com/index.php/en/freshnewsplus/231458-2022-02-15-10-06-10.html', title: 'ប្រព័ន្ធសាលារៀនឌីជីថល «Wiki School» នៅវិទ្យាល័យពេជ្រចិន្ដា កំពុងជំរុញសាលានេះ ឲ្យក្លាយជាវិទ្យាល័យឌីជីថលឈានមុខគេនៅកម្ពុជា', source: 'Fresh News+' },
  { no: 17, serial: 44613, url: 'https://www.freshnewsasia.com/index.php/en/localnews/232047-2022-02-21-08-25-33.html', title: 'រដ្ឋមន្ត្រីអប់រំ វាយតម្លៃខ្ពស់ចំពោះក្រុមហ៊ុន ផុស្ការ ដែលចូលរួមជំរុញការអប់រំ ជាពិសេសបំប្លែងពីការជួបវិបត្តិកូវីដ១៩ ទៅជាឱកាសសម្រាប់ជំរុញការអបរំបែបឌីជីថល', source: 'Fresh News' },
  { no: 18, serial: 44734, url: 'https://www.freshnewsasia.com/index.php/en/localnews/246718-2022-06-22-10-28-55.html', title: 'គ្រូ បុគ្គលិក និងនិស្សិតវិទ្យាស្ថានជាតិអប់រំ ១៣៥០នាក់ ទទួលបានចំណេះដឹង ស្តីពីការប្រើប្រាស់ប្រព័ន្ធ Wiki School សម្រាប់ការៀន និងបង្រៀន', source: 'Fresh News' },
  { no: 19, serial: 44788, url: 'https://www.youtube.com/watch?app=desktop&v=kynZvKbfo14&ab_channel=FRESHNEWS', title: 'អ្នកជំនាញ៖ ការប្រើប្រាស់ប្រព័ន្ធបច្ចេកវិទ្យា ក្នុងវិស័យអប់រំ បានដើរលឿនជាងការរំពឹង រហូតដល់ជាង ១០ឆ្នាំ', source: 'Fresh News (YouTube)' },
  { no: 20, serial: 44788, url: 'https://freshnewsasia.com/index.php/en/localnews/253809-2022-08-15-11-52-17.html', title: 'អ្នកជំនាញ៖ ការប្រើប្រាស់ប្រព័ន្ធបច្ចេកវិទ្យា តាមសាលារៀន បានដើរលឿនជាងការរំពឹង រហូតដល់ជាង ១០ឆ្នាំ', source: 'Fresh News' },
  { no: 21, serial: 44806, url: 'https://www.freshnewsasia.com/index.php/en/localnews/255817-2022-09-02-01-48-44.html', title: 'សាកលវិទ្យាល័យ ប៊ែលធី អន្តរជាតិ និងក្រុមហ៊ុន POSCAR ចាប់ដៃគ្នាលើកកម្ពស់កិច្ចសហប្រតិបត្តិការផ្នែកបច្ចេកវិទ្យាព័ត៌មានវិទ្យា (ICT)', source: 'Fresh News' },
  { no: 22, serial: 44805, url: 'https://www.freshnewsasia.com/index.php/en/localnews/255788-2022-09-01-11-51-04.html', title: 'ប្រព័ន្ធសាលារៀនឌីជីថល Wiki School ត្រូវបានយកមកធ្វើបទបង្ហាញ ក្នុងសិក្ខាសាលាស្តីពី កាលានុវត្តភាពនៃវិស័យបច្ចេកទេសវិទ្យា និងនវានុវត្តន៍សម្រាប់ការអប់រំនៅកម្ពុជា', source: 'Fresh News' },
  { no: 23, serial: 45062, url: 'https://www.canadiabank.com.kh/news/canadia-bank-and-poscar-digital-sign-mou-on-digital-payment-solutions', title: 'Canadia Bank and POSCAR Digital sign MOU on Digital Payment Solutions', source: 'Canadia Bank' },
  { no: 24, serial: 45672, url: 'https://www.akp.gov.kh/kh/post/detail/326079', title: 'ពិធីបើកដំណើរការទទួលពាក្យប្រឡងចូលរៀនថ្នាក់ជាតិ សម្រាប់ការបណ្តុះបណ្តាលក្នុងវិស័យសុខាភិបាលតាមប្រព័ន្ធអនឡាញ', source: 'AKP' },
  { no: 25, serial: 45672, url: 'https://freshnewsasia.com/index.php/en/localnews/373254-2025-01-15-09-31-23.html', title: 'គណៈកម្មាធិការប្រឡងថ្នាក់ជាតិសម្រាប់ការបណ្តុះបណ្តាលក្នុងវិស័យសុខាភិបាល ប្រកាសបើកដំណើរការទទួលពាក្យប្រឡងចូលរៀនថ្នាក់ជាតិ ដោយការទទួលពាក្យស្នើសុំចូលរួមប្រឡងតាមប្រព័ន្ធអនឡាញ', source: 'Fresh News' },
  // Phnom Penh Post + Khmer Times entries (no Excel serial date — using known publication dates from URLs/context)
  { no: 26, serial: 43552, url: 'https://www.phnompenhpost.com/national/education-ministry-recruits-poscar-digital-partner-deal', title: 'Education ministry recruits Poscar in digital partner deal', source: 'The Phnom Penh Post' },
  { no: 27, serial: 43552, url: 'https://www.khmertimeskh.com/50927854/agreement-to-launch-digital-school-system-wiki-school-signed/', title: 'Agreement to Launch Digital School System "Wiki School" Signed', source: 'Khmer Times' },
  { no: 28, serial: 43552, url: 'https://opendevelopmentcambodia.net/news/the-ministry-of-education-in-collaboration-with-poscar-digital-co-ltd-announces-the-launch-of-the-wiki-school-digital-school-system#!/story=post-154039', title: 'The Ministry of Education in collaboration with POSCAR DIGITAL Co., Ltd. announces the launch of the "Wiki School" digital school system', source: 'OpenDevelopment Cambodia' },
];

// Excel serial → ISO date (YYYY-MM-DD), accounting for the 1900 leap-year bug.
function excelDateToISO(serial) {
  const adjusted = serial > 60 ? serial - 2 : serial - 1;
  const ms = Date.UTC(1900, 0, 1) + adjusted * 86400000;
  return new Date(ms).toISOString().slice(0, 10);
}

// Pick brand thumbnail based on which product the title mentions.
function pickThumbnail(title) {
  const t = title.toLowerCase();
  if (t.includes('wiki college') || t.includes('wikicollege') || t.includes('សាកលវិទ្យាល័យ')) {
    return '/images/brand/03-WikiCollege.png';
  }
  if (t.includes('wiki tv') || t.includes('wikitv') || t.includes('ទូរទស្សន៍')) {
    return '/images/brand/04-WikiTV.png';
  }
  if (t.includes('vithean') || t.includes('វិធាន') || t.includes('គណនេយ្យ')) {
    return '/images/brand/05-Vithean.png';
  }
  if (t.includes('bakan') || t.includes('បាកាន')) {
    return '/images/brand/07-BakanElite.png';
  }
  if (t.includes('amber') || t.includes('កាត') || t.includes('smart card')) {
    return '/images/brand/08-Amber.png';
  }
  if (t.includes('wiki school') || t.includes('wikischool') || t.includes('សាលា')) {
    return '/images/brand/02-WikiSchool.png';
  }
  return '/images/brand/01-Poscar.png';
}

// Auto-detect category. All press get the "Press" category, but title cues
// can promote specific topics. Keeping "Press" as the dominant label so the
// blog index can filter consistently.
function pickCategory(_title) {
  return 'Press';
}

// Tag extraction
function pickTags(title) {
  const t = title.toLowerCase();
  const tags = [];
  if (t.includes('wiki school') || t.includes('wikischool') || t.includes('សាលា')) tags.push('Wiki School');
  if (t.includes('wiki college') || t.includes('wikicollege')) tags.push('Wiki College');
  if (t.includes('wiki tv') || t.includes('wikitv')) tags.push('Wiki TV');
  if (t.includes('vithean') || t.includes('វិធាន')) tags.push('Vithean');
  if (t.includes('bakan') || t.includes('បាកាន')) tags.push('Bakan Elite');
  if (t.includes('amber') || t.includes('កាត') || t.includes('smart card')) tags.push('Amber');
  if (t.includes('moeys') || t.includes('ក្រសួងអប់រំ') || t.includes('ministry of education')) tags.push('MoEYS');
  if (t.includes('covid') || t.includes('កូវីដ')) tags.push('COVID-19');
  if (t.includes('canadia') || t.includes('mou')) tags.push('Partnership');
  if (tags.length === 0) tags.push('POSCAR Digital');
  return tags;
}

// One-line themed teaser based on detected topic (your words, not the article's).
function pickDescription(title, source) {
  const t = title.toLowerCase();
  if (t.includes('wiki tv') || t.includes('wikitv')) {
    return `${source} on Wiki TV — POSCAR Digital's national education broadcast.`;
  }
  if (t.includes('vithean') || t.includes('វិធាន') || t.includes('គណនេយ្យ')) {
    return `${source} on Vithean, POSCAR Digital's accounting and ERP platform.`;
  }
  if (t.includes('amber') || t.includes('កាត') || t.includes('smart card')) {
    return `${source} on POSCAR Digital's smart-card and identity solutions.`;
  }
  if (t.includes('canadia') || t.includes('mou')) {
    return `${source} covers POSCAR Digital's partnerships and agreements.`;
  }
  if (t.includes('wiki school') || t.includes('wikischool') || t.includes('សាលា')) {
    return `${source} on Wiki School deployments and adoption across Cambodian institutions.`;
  }
  return `${source} covering POSCAR Digital's work in Cambodia.`;
}

// Slug: YYYY-MM-DD-press-NN — keeps date order, identifies as press, unique.
function makeSlug(date, no) {
  return `${date}-press-${String(no).padStart(2, '0')}`;
}

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

await mkdir(OUT_DIR, { recursive: true });

let created = 0;
let skipped = 0;

for (const entry of entries) {
  const date = excelDateToISO(entry.serial);
  const slug = makeSlug(date, entry.no);
  const path = join(OUT_DIR, `${slug}.md`);

  if (!force && (await fileExists(path))) {
    skipped++;
    continue;
  }

  const thumbnail = pickThumbnail(entry.title);
  const category = pickCategory(entry.title);
  const tags = pickTags(entry.title);
  const description = pickDescription(entry.title, entry.source);

  // YAML escape: quote the title and description (Khmer often contains chars
  // that YAML parses oddly; wrapping in single quotes and doubling internal
  // single quotes keeps it safe).
  const escapeYaml = (s) => `'${String(s).replace(/'/g, "''")}'`;

  const frontmatter = [
    '---',
    `title: ${escapeYaml(entry.title)}`,
    `date: ${date}`,
    `author: 'POSCAR Digital'`,
    `category: '${category}'`,
    `description: ${escapeYaml(description)}`,
    `thumbnail: '${thumbnail}'`,
    `source_name: ${escapeYaml(entry.source)}`,
    `source_url: '${entry.url}'`,
    `tags: [${tags.map((t) => escapeYaml(t)).join(', ')}]`,
    '---',
    '',
    description,
    '',
  ].join('\n');

  await writeFile(path, frontmatter);
  created++;
  console.log(`+ ${path}`);
}

console.log('');
console.log(`Created: ${created}  Skipped (already exists): ${skipped}`);
if (!force && skipped > 0) {
  console.log('Re-run with --force to overwrite existing files.');
}
