const RecordError = require('../exceptions/record.error')

const permissionType = 'ნებართვა'

class Organization {
  constructor(mainInfo) {
    this.regulations = []
    this.businesses = []
    this.branches = []

    Object.assign(this, mainInfo)

    if (this.bedStock != null && this.bedStock < 0) throw new RecordError('საწოლთა ფონდი არ შეიძლება იყოს უარყოფითი რიცხვი')
  }

  addRegulation(regulation) {
    if (regulation.type === permissionType && this.hasPermission()) {
      throw new RecordError('ორგანიზაციას შეიძლება ჰქონდეს მხოლოდ ერთი ნებართვა')
    }

    this.regulations.push(regulation)
  }

  addBusiness(business) {
    if (!this.regulations.find(item => item.id === business.regulationId)) {
      throw new RecordError('ორგანიზაციას არ აქვს საქმიანობის რეგულაცია')
    }

    this.businesses.push(business)
  }

  addBranch(branch) {
    let organizationBusinessIds = new Set(this.businesses.map(item => item.id))

    let ids = branch.businessIds.filter(id => !organizationBusinessIds.has(id))

    if (ids.length > 0) throw new RecordError('ფილიალს არ შეიძლება ჰქონდეს ორგანიზაციისგან განსხვავებული საქმიანობა')

    this.branches.push(branch)
  }

  hasPermission() {
    let permission = this.regulations.find(regulation => regulation.type === permissionType)

    return !!permission // permission exists
  }
}

module.exports = Organization
