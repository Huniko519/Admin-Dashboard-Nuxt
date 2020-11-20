import { required, integer, email } from 'vuelidate/lib/validators'

export const DealValidations = {
  dealData: {
    merchant: {
      required,
    },
    category: {
      required,
    },
    // branches: {
    //   required,
    // },
    name: {
      required,
    },
    arName: {
      required,
    },
    type: {
      required,
    },
    dealType: {
      required,
    },
    dealStartDate: {
      required,
    },
    dealEndDate: {
      required,
    },
    finePrint: {
      required,
    },
    description: {
      required,
    },
    arDescription: {
      required,
    },
    prices: {
      originalPrice: {
        required,
        integer,
      },
      // finalPrice: {
      //   required,
      //   integer,
      // },
      description: {
        required,
      },
      arDescription: {
        required,
      },
    },
    percentage: {
      required,
      integer,
    },
    payoutNet: {
      required,
      integer,
    },
    yallaDealzCommission: {
      required,
      integer,
    },
    voucher: {
      finalPrice: {
        required,
        integer,
      },
      validUntil: {
        required,
      },
      minimumQuantityAllowed: {
        required,
        integer,
      },
      maximumQuantityAllowed: {
        required,
        integer,
      },
      userAllowedFrom: {
        required,
        integer,
      },
      userAllowedUpto: {
        required,
        integer,
      },
      allowedQuantity: {
        required,
        integer,
      },
      validFor: {
        required,
      },
      minimumAge: {
        required,
        integer,
      },
      validOn: {
        required,
      },
    },
    highlightes: {
      required,
    },
    arHighlightes: {
      required,
    },
    priorBooking: {
      status: {
        required,
      },
      deliveryArea: {
        required,
      },
      email: {
        required,
        email,
      },
      contactNumber: {
        required,
        integer,
      },
    },
    paymentMethod: {
      required,
    },
  },
}
