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
seedData(testLocations, 'lib', indexDefaultOptions, 'location', true)
