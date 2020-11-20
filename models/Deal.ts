import { DealPrice } from './DealPrice'
import { Voucher } from './Voucher'

export class Deal {
  dealLive = false
  branches = []
  merchant = ""
  category = ""
  name = ""
  arName = ""
  images = []
  video = ""
  dealType = ""
  type = []
  dealStartDate = ""
  dealEndDate = ""
  prices = [
    new DealPrice(),
  ]
  percentage = ""
  payoutNet = 0
  yallaDealzCommission = ""
  voucher = new Voucher()
  priorBooking = {
    status: false,
    email: "",
    contactNumber: "",
    deliveryArea: "",
    delivery: false,
  }
  finePrint = ""
  arFinePrint = ""
  description = ""
  arDescription = ""
  highlightes = ""
  arHighlightes = ""
  paymentMethod: string | Array<string> = ""
}
