var elasticsearch = require('elasticsearch')
var client = new elasticsearch.Client({
  host: 'localhost:9999',
  log: 'trace'
})
const shortid = require('shortid')

async function createIndex(name, option) {
  await client.indices.create({
    index: name,
    body: option
  })
}

async function deleteIndex(index) {
  await client.indices.delete({
    index: index
  })
}

async function insertData(index, type, users) {
  let bulk = []
  let action = { index: { _index: index, _type: type } }

  users.forEach(item => bulk.push(action, item))

  await client.bulk({
    body: bulk
  })
}

const indexDefaultOptions = {
  'settings': {
    'index': {
      'number_of_shards': 1,
      'number_of_replicas': 1
    }
  }
}

const testLocations = [{
  locationsInGeorgia: [
    {
      locationName: 'თბილისი',
      units: [
        { locationUnitName: 'ვაკე' },
        { locationUnitName: 'ისანი' },
        { locationUnitName: 'კრწანისი' },
        { locationUnitName: 'მთაწმინდა' },
        { locationUnitName: 'გლდანი' },
        { locationUnitName: 'დიდუბე' },
        { locationUnitName: 'ნაძალადევი' },
        { locationUnitName: 'ჩუღურეთი' },
        { locationUnitName: 'საბურთალო' },
        { locationUnitName: 'სამგორი' }
      ]
    },
    {
      locationName: 'გურია',
      units: [
        { locationUnitName: 'ოზურგეთი' },
        { locationUnitName: 'ლანჩხუთი' },
        { locationUnitName: 'ჩოხატაური' }
      ]
    },
    {
      locationName: 'რაჭა-ლეჩხუმი & ქვემო სვანეთი',
      units: [
        { locationUnitName: 'ამბროლაური' },
        { locationUnitName: 'ლენტეხი' },
        { locationUnitName: 'ონი' },
        { locationUnitName: 'ცაგერი' }
      ]
    },
    {
      locationName: 'კახეთი',
      units: [
        { locationUnitName: 'ახმეტა' },
        { locationUnitName: 'გურჯაანი' },
        { locationUnitName: 'დედოფლის წყარო' },
        { locationUnitName: 'თელავი' },
        { locationUnitName: 'ლაგოდეხი' },
        { locationUnitName: 'საგარეჯო' },
        { locationUnitName: 'სიღნაღი' },
        { locationUnitName: 'ყვარლი' }
      ]
    },
    {
      locationName: 'იმერეთი',
      units: [
        { locationUnitName: 'ბაღდათი' },
        { locationUnitName: 'ვანი' },
        { locationUnitName: 'ზესტაფონი' },
        { locationUnitName: 'თერჯოლა' },
        { locationUnitName: 'სამტრედია' },
        { locationUnitName: 'საჩხერე' },
        { locationUnitName: 'ტყიბული' },
        { locationUnitName: 'ქუთაისი' },
        { locationUnitName: 'წყალტუბო' },
        { locationUnitName: 'ჭიათურა' },
        { locationUnitName: 'ხარაგაული' },
        { locationUnitName: 'ხონი' }
      ]
    },
    {
      locationName: 'მცხეთა-მთიანეთი  ',
      units: [
        { locationUnitName: 'ახალგორი' },
        { locationUnitName: 'დუშეთი' },
        { locationUnitName: 'თიანეთი' },
        { locationUnitName: 'მცხეთა' },
        { locationUnitName: 'ყაზბეგი' }
      ]
    },
    {
      locationName: 'სამეგრელო-ზემო სვანეთი',
      units: [
        { locationUnitName: 'აბაშა' },
        { locationUnitName: 'ზუგდიდი' },
        { locationUnitName: 'მარტვილი' },
        { locationUnitName: 'მესტია' },
        { locationUnitName: 'სენაკი' },
        { locationUnitName: 'ფოთი' },
        { locationUnitName: 'ჩხოროწყუ' },
        { locationUnitName: 'წალენჯიხა' },
        { locationUnitName: 'ხობი' }
      ]
    },
    {
      locationName: 'სამცხე-ჯავახეთი',
      units: [
        { locationUnitName: 'ადიგენი' },
        { locationUnitName: 'ასპინძა' },
        { locationUnitName: 'ახალქალაქი' },
        { locationUnitName: 'ახალციხე' },
        { locationUnitName: 'ბორჯომი' },
        { locationUnitName: 'ნინოწმინდა' }
      ]
    },
    {
      locationName: 'ქვემო ქართლი ',
      units: [
        { locationUnitName: 'ბოლნისი' },
        { locationUnitName: 'გარდაბნი' },
        { locationUnitName: 'დმანისი' },
        { locationUnitName: 'თეთრი წყარო' },
        { locationUnitName: 'მარნეული' },
        { locationUnitName: 'რუსთავი' },
        { locationUnitName: 'წალკის' }
      ]
    },
    {
      locationName: 'შიდა ქართლი ',
      units: [
        { locationUnitName: 'გორი' },
        { locationUnitName: 'კასპი' },
        { locationUnitName: 'ქარელი' },
        { locationUnitName: 'ხაშური' }
      ]
    },
    {
      locationName: 'აჭარის ავტონომიური რესპუბლიკა',
      units: [
        { locationUnitName: 'ბათუმი' },
        { locationUnitName: 'ქედა' },
        { locationUnitName: 'ქობულეთი' },
        { locationUnitName: 'შუახევი' },
        { locationUnitName: 'ხელვაჩაური' },
        { locationUnitName: 'ხულო' }
      ]
    },
    {
      locationName: 'აფხაზეთი',
      units: [
        { locationUnitName: 'გაგრა' },
        { locationUnitName: 'გუდაუთა' },
        { locationUnitName: 'სოხუმი' },
        { locationUnitName: 'გულრიფში' },
        { locationUnitName: 'ოჩამჩირე' },
        { locationUnitName: 'გალი' },
        { locationUnitName: 'ტყვარჩელი' }
      ]
    }

  ]
}]

const regulationId = shortid.generate()
const permissionId = shortid.generate()
const businessId = shortid.generate()
const testOrganizations = [
  {
    taxCode: '00001',
    georgianName: 'შპს ხვლიკი',
    latinName: 'Lizard Inc',
    phone: '111222',
    naprOfficePhone: '12121',
    email: null,
    ehealthEmail: '00001@ehealth.gov.ge',
    statusId: 0,
    status: 'active',
    statusGeoName: 'აქტიური',
    naprStatus: 'რეგისტრირებულია',
    managementRegistrationNumber: '2878',
    treasuryRegistrationNumber: '000010101000',
    treasuryRegistrationDate: '2016-11-09',
    treasuryRegistrationPlace: 'სასამართლო',
    juridicalAddress: {
      region: 'თბილისი',
      district: 'დიდუბე',
      settlement: 'დიდუბე',
      addressDescription: 'წერეთელზე',
      postalCode: null
    },
    factualAddress: {
      region: 'თბილისი',
      district: 'დიდუბე',
      settlement: 'დიდუბე',
      addressDescription: 'წერეთელზე',
      postalCode: null
    },
    organizationType: 'სტაციონარული',
    legalForm: 'შეზღუდული პასუხისმგებლობის საზოგადოება (შპს)',
    bedStock: 100,
    branches: [
      {
        id: shortid.generate(),
        name: 'შპს ხვლიკი',
        status: 'აქტიური',
        startDate: '2018-02-08',
        registrationNumber: '810',
        functioningReason: null,
        cancelDate: null,
        businessIds: [
          businessId
        ],
        region: 'ქვემო ქართლი',
        district: 'რუსთავი',
        settlement: 'რუსთავი',
        addressDescription: 'სასტუმროსთან',
        postalCode: null
      }
    ],
    regulations: [
      {
        id: regulationId,
        type: 'ლიცენზია',
        documentNumber: '12112',
        issueReason: 'რაღაც',
        issueDate: '2018-02-04',
        registerNumber: '22-5555',
        commandType: 'გაცემა',
        cancelReason: null,
        cancelDate: null,
        hasDuplicate: true,
        duplicateNumber: '545455',
        duplicateIssueReason: 'დოკუმენტის დაკარგვა',
        duplicateIssueDate: '2018-02-04',
        comment: 'სატესტო'
      },
      {
        id: permissionId,
        type: 'ნებართვა',
        documentNumber: '12345',
        issueReason: 'რაააღაც',
        issueDate: '2017-02-05',
        registerNumber: '33-545',
        commandType: 'გაცემა',
        cancelReason: null,
        cancelDate: null,
        hasDuplicate: true,
        duplicateNumber: '54333',
        duplicateIssueReason: 'დოკუმენტის დაკარგვა',
        duplicateIssueDate: '2018-02-08',
        comment: 'სატესტო'
      }
    ],
    businesses: [
      {
        id: businessId,
        regulationId: regulationId,
        businessType: 'სასწრაფო სამედიცინო დახმარების ლიცენზია',
        additionalBusinessInformation: null,
        documentNumber: null,
        issueReason: null,
        issueDate: null,
        cancelReason: null,
        cancelDate: null,
        hasDuplicate: false,
        duplicateIssueDate: null,
        duplicateIssueReason: null
      },
      {
        id: shortid.generate(),
        regulationId: permissionId,
        businessType: 'რეანიმაცია',
        additionalBusinessInformation: null,
        documentNumber: '77887',
        issueReason: 'სატესტო',
        issueDate: '2017-03-01',
        cancelReason: null,
        cancelDate: null,
        hasDuplicate: true,
        duplicateIssueDate: '2018-01-08',
        duplicateIssueReason: 'დოკუმენტის დაზიანება'
      }
    ],
    clinicalManagers: [
      {
        personalId: '0000',
        firstName: 'ვიღაც',
        lastName: 'ვიღაც',
        phone: null,
        email: null,
        appointingDate: '2018-02-07',
        firingDate: null
      }
    ],
    managers: [
      {
        position: 'დირექტორი',
        other: null,
        personalId: '00001',
        firstName: 'ვიღაც1',
        lastName: 'ვიღაც1',
        phone: null,
        email: null
      }
    ],
    founders: [
      {
        personalId: null,
        fullName: null,
        founderCompanyName: 'შპს რაღაც',
        taxCode: '000',
        founderType: 'ქართული ორგანიზაცია',
        share: '100%',
        legalForm: 'შეზღუდული პასუხისმგებლობის საზოგადოება (შპს)'
      }
    ]
  }
]

const testRegulationTypes = [
  {
    regulationType: 'ლიცენზია',
    businessTypes: [
      { type: 'სასწრაფო სამედიცინო დახმარების ლიცენზია' },
      { type: 'სასამართლო-სამედიცინო ექსპერტიზის ლიცენზია' },
      { type: 'სასამართლო-ფსიქიატრიული ექსპერტიზის ლიცენზია' },
      { type: 'პათოლოგანატომიური საქმიანობის ლიცენზია ' },
      { type: 'რენტგენოლოგიური დიაგნოსტიკის ლიცენზია' },
      { type: 'საწარმოო ტრანსფუზიოლოგიური საქმიანობის ლიცენზია' }
    ]
  },
  {
    regulationType: 'ნებართვა',
    businessTypes: [
      { type: 'ონკოლოგია' },
      { type: 'ფსიქიატრია' },
      { type: 'სტაციონარული დაწესებულების ნებართვა' },
      { type: 'ნეონატოლოგია' },
      { type: 'ინტერვენციული კარდიოლოგია' },
      { type: 'ინფექციური დაავადებების მკურნალობა' },
      { type: 'ქირურგიული პროფილის საქმიანობა' },
      { type: 'ნეიროქირურგია' },
      { type: 'ორგანოებისა და ქსოვილების აღება, შენახვა, გადანერგვა' },
      { type: 'სამეანო-გინეკოლოგიური პროფილის საქმიანობა - გინეკოლოგია' },
      { type: 'მეანობა' },
      { type: 'რეანიმაცია' },
      { type: 'გადაუდებელი სამედიცინო დახმარება-EMERGENCY' },
      { type: 'რადიოლოგიური საქმიანობა - რენტგენოლოგიური დიაგნოსტიკა' },
      { type: 'რადიოლოგიური საქმიანობა - კომპიუტერულ-ტომოგრაფიული კვლევა' },
      { type: 'რადიოლოგია' },
      { type: 'ოფთალმოლოგია' },
      { type: 'ოტორინოლარინგოლოგია' },
      { type: 'დიალიზი-ნებართვა' },
      { type: 'ფთიზიატრია-ნებართვა' },
      { type: 'ლაბორატორიული საქმიანობა (ნებართვა) - კლინიკური დიაგნოსტიკა' },
      { type: 'ლაბორატორიული საქმიანობა (ნებართვა) - ბიოქიმიური დიაგნოსტიკა' },
      { type: 'ლაბორატორიული საქმიანობა (ნებართვა) - იმუნოლოგიური და სეროლოგიური დიაგნოსტიკა' },
      { type: 'ლაბორატორიული საქმიანობა (ნებართვა) - მიკრობიოლოგიური' },
      { type: 'დიაგნოსტიკა' },
      { type: 'ლაბორატორიული საქმიანობა (ნებართვა) - მოლეკულური დიაგნოსტიკა' },
      { type: 'სამეანო-ნეონატალური საქმიანობა' },
      { type: 'ახალშობილთა ინტენსიური მოვლა' },
      { type: 'ლაბორატორიული საქმიანობა (ნებართვა) - გინეკოლოგიური პროფილის საქმიანობა' },
      { type: 'ლაბორატორიული საქმიანობა (ნებართვა) - ბიოლოგიური მასალის ნიმუშების მიღება/ჩაბარება და აღება/გამოყოფა სხვა დაწესებულებაში (მათ შორის, ქვეყნის გარეთ) გამოსაკვლევად გაგზავნის მიზნით' },
      { type: 'ორგანოს, ორგანოთა ნაწილების, ქსოვილებისა და უჯრედების აღება და/ან შენახვა და/ან გადანერგვა' }
    ]
  },
  {
    regulationType: 'შეტყობინება',
    businessTypes: [
      {
        type: '1. სტომატოლოგია',
        subtypes: [
          '1.1 თერაპიული',
          '1.2 ქირურგიული',
          '1.3 ორთოპედიული'
        ]
      },
      {
        type: '2. ქირურგია',
        subtypes: [
          '2.1 ანგიოქირურგია',
          '2.2 უროლოგია',
          '2.3 პროქტოლოგია',
          '2.4 ტრავმატოლოგია და ორთოპედია',
          '2.5 ოფთალმოლოგიური ქირურგია',
          '2.6 ოტორინოლარინგოლოგია',
          '2.7 ონკოლოგია',
          '2.8 გინეკოლოგია'
        ]
      },
      { type: '3. მეანობა-გინეკოლოგია' },
      { type: '4. გადაუდებელი სამედიცინო დახმარება (EMERGENCY)' },
      { type: '5. დერმატო-ვენეროლოგია (მ.შ. დერმატოკოსმეტოლოგია)' },
      {
        type: '6. რადიოლოგია (გარდა ულტრაბგერითი დიაგნოსტიკისა)',
        subtypes: [
          '6.1 რენტგენოლოგიური დიაგნოსტიკა',
          '6.2 რენტგენოლოგიური დიაგნოსტიკა (დენტალური)',
          '6.3 კომპიუტერულ ტომოგრაფიული კვლევა',
          '6.4 მამოგრაფია'
        ]
      },
      { type: '7. დიალიზი' },
      { type: '8. ინფექციურ დაავადებებთან (მათ შორის, აივ ინფექციასთან/შიდსთან) დაკავშირებული საქმიანობა' },
      { type: '9. ფთიზიატრია' },
      { type: '10. ენდოსკოპია' },
      { type: '11. იმუნიზაცია' },
      { type: '12. ოფთალმოლოგიური სერვისის ფარგლებში ორგანოს, ორგანოთა ნაწილების, ქსოვილებისა და უჯრედების აღება ან/და შენახვა და/ან გადანერგვა' },
      { type: 'ლაბორატორიული საქმიანობა (შეტყობინება) - კლინიკური დიაგნოსტიკა' },
      { type: 'ლაბორატორიული საქმიანობა (შეტყობინება) - ბიოქიმიური დიაგნოსტიკა' },
      { type: 'ლაბორატორიული საქმიანობა (შეტყობინება) - იმუნოლოგიური და სეროლოგიური დიაგნოსტიკა' },
      { type: 'ლაბორატორიული საქმიანობა (შეტყობინება) - მიკრობიოლოგიური დიაგნოსტიკა' },
      { type: 'ლაბორატორიული საქმიანობა (შეტყობინება) - მოლეკულური დიაგნოსტიკა' },
      { type: 'ლაბორატორიული საქმიანობა (შეტყობინება) - ბიოლოგიური მასალის ნიმუშების მიღება/ჩაბარება და აღება/გამოყოფა სხვა დაწესებულებაში (მათ შორის, ქვეყნის გარეთ) გამოსაკვლევად გაგზავნის მიზნით' },
      { type: 'საქმიანობა, რომელიც მოიცავს ინვაზიურ ჩარევას გაუტკივარებით' },
      { type: 'ქირურგია (ყველა პროფილის, მ.შ. ოფთალმოქირურგია)' }
    ]
  }
]

async function seedData(data, index, indexOption, type, dropIndexIfExists = false) {
  try {
    let exists = await client.indices.exists({ index: index })

    if (dropIndexIfExists === true && exists === true) {
      await deleteIndex(index)
    }

    if (dropIndexIfExists || !exists) {
      await createIndex(index, indexOption)
    }

    await insertData(index, type, data)
  } catch (error) {
    console.error(error)
  }
}

seedData(testOrganizations, 'organization', indexDefaultOptions, 'organization', true)
seedData(testLocations, 'location', indexDefaultOptions, 'location', true)
seedData(testRegulationTypes, 'regulationtype', indexDefaultOptions, 'regulationtype', true)
