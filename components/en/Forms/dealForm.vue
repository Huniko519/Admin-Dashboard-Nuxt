<template>
  <v-card elevation="10" class="p-3 ml-sm-2 mr-sm-6 mt-10 mt-md-3">
    <v-form ref="form" v-model="valid">

      <h4>Add Deal :-</h4>
      <hr>

      <div v-if="success != ''" class="en-dealForm-msg">
        <notification notfi-color="greenNotfi">
          {{ success }}
        </notification>
      </div>

      <div v-if="error != ''" class="en-contactPerson-msg">
        <notification notfi-color="redNotfi">
          {{ error }}
        </notification>
      </div>

      <v-row justify="center" dense>
        <v-col cols="10" md="5">
          <v-text-field v-model="dealData.name" :rules="[(v) => !!v || 'Deal Name is required']" label="Deal Name" required @input="setName" solo dense rounded />
        </v-col>

        <v-col cols="10" md="5">
          <v-text-field v-model="dealData.arName" :rules="[(v) => !!v || 'اسم العرض مطلوب']" label="اسم العرض" required @input="setArname" solo dense rounded />
        </v-col>

        <v-col cols="10" md="5">
          <v-select v-model="dealData.merchant" label="Merchant" :rules="[(v) => !!v || 'Merchant is required']" required :items="merchants" item-value="_id" item-text="name" @change="setMerchant" solo dense rounded />
        </v-col>

        <v-col cols="10" md="5">
          <v-select v-model="dealData.category" label="Category" :rules="[(v) => !!v || 'Category is required']" required :items="flatCategories" item-value="_id" item-text="name" @change="setCategory" solo dense rounded />
        </v-col>

        <v-col cols="10" md="5">
          <v-select v-model="dealData.branches" :multiple="true" label="Branch" required :items="branchesToShow" item-value="_id" item-text="name" @changed="setBranches" solo dense rounded />
        </v-col>

        <v-col cols="10">
          <v-row v-if="dealData.images.length" justify="center" class="text-center" dense>
            <v-col cols="5">
              <v-btn color="red" dark rounded small @click="removeImage">Remove Cover</v-btn>
            </v-col>
            <v-col cols="12"></v-col>
            <v-col cols="4" v-for="(image, index) in dealData.images" :key="index" class="d-flex flex-column justify-content-center">
              <v-img :src="image.base64" :key="index" :alt="image.base64" width="100%"></v-img>
              <v-btn color="red" class="flex-grow-0" dark x-small @click="removeSingleImage(index)">x</v-btn>
            </v-col>
          </v-row>
          
          <v-row justify="center" class="flex-column" dense v-if="!dealData.images.length">
            <v-btn color="red" dark rounded>
              <label for="image-upload" class="my-auto pointer">
                <v-icon>mdi-upload</v-icon>
                <span>Upload Image</span>
              </label>
            </v-btn>
            <span class="ml-auto pr-3 red--text">Image is a must</span>
            <input v-show="false" id="image-upload" ref="imageUpload" multiple type="file" @change="onFileChange">
            <v-checkbox v-model="dealData.dealLive" color="red" class="mx-auto" label="Live Deal"></v-checkbox>
          </v-row>
        </v-col>

        <v-col cols="10">
          <v-text-field v-model="dealData.video" label="Video Link" @input="setVideo" solo dense rounded />
        </v-col>

        <v-col cols="10" class="my-5">
          <h6 class="text-center">Highlights</h6>
          <vue-editor v-model="dealData.highlightes" placeholder="Highlights" :rules="[(v) => !!v || 'Highlights is required']" required @input="setHighlight" solo dense></vue-editor>
          <!-- <v-textarea v-model="dealData.highlightes" placeholder="Highlights" :rules="[(v) => !!v || 'Highlights is required']" required @input="setHighlight" solo dense /> -->
        </v-col>

        <v-col cols="10" class="my-5">
          <h6 class="text-center">Description</h6>
          <vue-editor v-model="dealData.description" placeholder="Description" :rules="[(v) => !!v || 'description is required']" required @input="setDescription" solo dense></vue-editor>
          <!-- <v-textarea v-model="dealData.description" placeholder="Description" :rules="[(v) => !!v || 'description is required']" required @input="setDescription" solo dense /> -->
        </v-col>

        <v-col cols="10" class="my-5">
          <h6 class="text-center">Rules or Fine Print</h6>
          <vue-editor v-model="dealData.finePrint" class="textEditor" placeholder="Fine Print" :rules="[(v) => !!v || 'Fine Print is required']" required solo dense></vue-editor>
          <!-- <v-textarea v-model="dealData.finePrint" placeholder="Fine Print" :rules="[(v) => !!v || 'Fine Print is required']" required solo dense /> -->
        </v-col>

        <v-col cols="10" class="my-5">
          <h5 class="text-center">ابرز المعلومات</h5>
          <vue-editor v-model="dealData.arHighlightes" placeholder="ابرز المعلومات" :rules="[(v) => !!v || ' ابرز المعلومات مطلوبه']" required @input="setArhighlight" solo dense></vue-editor>
          <!-- <v-textarea v-model="dealData.arHighlightes" placeholder="ابرز المعلومات" :rules="[(v) => !!v || ' ابرز المعلومات مطلوبه']" required @input="setArhighlight" solo dense /> -->
        </v-col>

        <v-col cols="10" class="my-5">
          <h5 class="text-center">الوصف</h5>
          <vue-editor v-model="dealData.arDescription" placeholder="الوصف" :rules="[(v) => !!v || 'Description ar is required']" required @input="setArDescription" solo dense></vue-editor>
          <!-- <v-textarea v-model="dealData.arDescription" placeholder="الوصف" :rules="[(v) => !!v || 'Description ar is required']" required @input="setArDescription" solo dense /> -->
        </v-col>

        <v-col cols="10" class="my-5">
          <h5 class="text-center">الشروط</h5>
          <vue-editor v-model="dealData.arFinePrint" placeholder="الشروط" :rules="[(v) => !!v || 'Fine Print ar is required']" required solo dense></vue-editor>
          <!-- <v-textarea v-model="dealData.arFinePrint" placeholder="الشروط" :rules="[(v) => !!v || 'Fine Print ar is required']" required solo dense /> -->
        </v-col>
        
      </v-row>

      <h4 class="text-center mt-10">Type</h4>
      <hr class="my-5">
      <v-row justify="center">
        <v-col cols="10" md="5">
          <v-select v-model="dealData.dealType" label="Deal Type" :items="dealTypes" item-value="val" item-text="name" @change="setDealType" solo dense rounded />
        </v-col>
        <v-col cols="12" md="10" class="d-flex justify-content-between">
          <v-checkbox v-model="dealData.type" v-for="(DT,index) in types" :label="DT.name" :key="'dt'+index" :value="DT.val" />
        </v-col>
        <v-col cols="10" md="5">
          <v-text-field v-model="dealData.dealStartDate" :rules="[(v) => !!v || 'Date is required']" label="Start Date" required type="datetime-local" @input="setDate" solo dense rounded />
        </v-col>
        <v-col cols="10" md="5">
          <v-text-field v-model="dealData.dealEndDate" :rules="[(v) => !!v || 'Date is required']" label="End Date" required type="datetime-local" @input="setEndDate" solo dense rounded />
        </v-col>
      </v-row>

      <h4 class="text-center mt-10">Price Info</h4>
      <hr>

      <v-row justify="center">
        <v-col cols="10" class="d-flex justify-content-end">
          <v-btn color="info" @click="add_price_form()" rounded>+ Add Price</v-btn>
        </v-col>

        <v-col cols="10" v-for="(tier, index) in dealData.prices" :key="index">
          <v-row justify="center" class="text-center" dense>
            <v-col cols="12" class="d-flex justify-content-between mb-3">
              <span class="ml-3">Price ({{ index +1 }})</span>
              <v-btn color="red" class="ml-3" @click="delete_price_form(index)" dark small rounded>Delete price</v-btn>
            </v-col>
            <v-col cols="12" md="6">
              <span>Original Price</span>
              <v-text-field v-model="tier.originalPrice" hint="Original Price" type="number" required :rules="[(v) => !!v || 'Original Price is required']" solo dense rounded />
            </v-col>
            <v-col cols="12" md="6">
              <span>Final Price</span>
              <v-text-field v-model="tier.finalPrice" hint="Final Price" type="number" :rules="[(v) => !!v || 'Final Price is required']" required solo dense rounded />
            </v-col>
            <v-col cols="12" md="6">
              <span>From Date</span>
              <v-text-field v-model="tier.pricesDate.dateDayFrom" hint="From Date"  type="datetime-local" solo dense rounded />
            </v-col>
            <v-col cols="12" md="6">
              <span>To Date</span>
              <v-text-field v-model="tier.pricesDate.dateDayTo" hint="To Date"  type="datetime-local" solo dense rounded />
            </v-col>

            <v-col cols="12"  v-for="(s,s_index) in tier.size" :key="'s'+s_index">
              <v-row justify="center" class="text-center" dense>
                <v-col cols="12" class="d-flex justify-content-center">
                  <span>Selected Color: {{ tier.color[s_index]}}</span>
                </v-col>
                <v-col cols="12" class="d-flex justify-content-center">
                  <v-color-picker v-model="tier.color[s_index]" label="Color" elevation="5"></v-color-picker>
                </v-col>
                <v-col cols="10" md="6" class="mt-5">
                  <span>Size</span>
                  <v-text-field v-model="tier.size[s_index]" hint="Size" solo dense rounded/>
                </v-col>
                <v-col cols="12"></v-col>
                <v-col cols="10" md="6">
                  <v-btn v-if="s_index == 0" @click="tier.size.push(''); tier.color.push('');" color="info" block rounded>Add size and color</v-btn>
                  <v-btn v-else @click="tier.size.splice(s_index,s_index); tier.color.splice(s_index,s_index);" color="red" dark block rounded>remove</v-btn>
                </v-col>
                <v-col cols="12" class="my-5"></v-col>
                <v-col cols="10" class="my-5">
                  <h6 class="text-center">الوصف</h6>
                  <vue-editor v-model="tier.arDescription" placeholder="الوصف" :rules="[(v) => !!v || 'الوصف مطلوب']" required solo dense></vue-editor>
                  <!-- <v-textarea v-model="tier.arDescription" placeholder="الوصف" :rules="[(v) => !!v || 'الوصف مطلوب']" required solo dense /> -->
                </v-col>
                <v-col cols="10" class="my-5">
                  <h6 class="text-center">Description</h6>
                  <vue-editor v-model="tier.description" placeholder="Description" :rules="[(v) => !!v || 'Description is required']" required solo dense></vue-editor>
                  <!-- <v-textarea v-model="tier.description" placeholder="Description" :rules="[(v) => !!v || 'Description is required']" required solo dense /> -->
                </v-col>
                <v-col cols="10" md="5">
                  <span>Precentage</span>
                  <v-text-field v-model="tier.percentage" hint="Percentage" type="number" :rules="[(v) => !!v || 'Percentage is required']" @input="setPercentage(index)" required solo rounded dense />
                </v-col>
                <v-col cols="10" md="5">
                  <span>Payout Net</span>
                  <v-text-field v-model="tier.payoutNet" hint="Payout Net" type="number" :rules="[(v) => !!v || 'Payout Net is required']" @input="setPayoutNet" required solo rounded dense/>
                </v-col>
                <v-col cols="10" md="5">
                  <span>Yalla Dealz Commission</span>
                  <v-text-field v-model="tier.yallaDealzCommission" hint="Yalla Dealz Commission" type="number" :rules="[(v) => !!v || 'Yalla Dealz Commission is required']" @input="setYDcommission" required solo rounded dense/>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <h4 class="text-center mt-5">Voucher Info</h4>
      <hr>
      <v-row justify="center" class="text-center" dense>
        <v-col cols="10" md="5">
          <span>Valid Untill</span>
          <v-text-field v-model="dealData.voucher.validUntil" label="Valid Untill" type="datetime-local" @input="setVvaliduntill" solo rounded dense />
        </v-col>
        <v-col cols="10" md="5">
          <span>Minimum Quantity Allowed</span>
          <v-text-field v-model="dealData.voucher.minimumQuantityAllowed" label="Minimum Quantity Allowed" type="number" @input="setVmqa" solo rounded dense />
        </v-col>
        <v-col cols="10" md="5">
          <span>Maximum Quantity Allowed</span>
          <v-text-field v-model="dealData.voucher.maximumQuantityAllowed" label="Maximum Quantity Allowed" type="number" @input="setVmxqa" solo rounded dense />
        </v-col>
        <v-col cols="10" md="5">
          <span>User Allowed From</span>
          <v-text-field v-model="dealData.voucher.userAllowedFrom" label="User Allowed From" type="number" @input="setVuserallowedfrom" solo rounded dense />
        </v-col>
        <v-col cols="10" md="5">
          <span>User Allowed Upto</span>
          <v-text-field v-model="dealData.voucher.userAllowedUpto" label="User Allowed Upto" type="number" @input="setVuserallowedfupto" solo rounded dense />
        </v-col>
      </v-row>

      <h4 class="text-center mt-5">Voucher Validation</h4>
      <hr>
      <v-row justify="center" class="text-center" dense>
        <v-col cols="10" md="5">
          <span>Minimum Age</span>
          <v-text-field v-model="dealData.voucher.minimumAge" label="Minimum Age" hint="Minimum Age" :rules="[(v) => !!v || 'Minimum Age is required']" required type="number" @input="setMinimumage" solo rounded dense />
        </v-col>
        <v-col cols="10" class="mt-5">Valid For</v-col>
        <v-col cols="10" class="d-flex justify-content-between">
          <v-checkbox v-model="dealData.voucher.validFor" color="red" v-for="(VF,index) in validFor" :label="VF.name" :key="'VF'+index" :value="VF.val" />
        </v-col>
        <v-col cols="10" class="mt-5">Valid On</v-col>
        <v-col cols="10" class="d-flex justify-content-center">
          <v-checkbox v-model="dealData.voucher.validOn" class="mr-10 ml-10" v-for="(VO,index) in vValid" :label="VO.name" :key="'VO'+index" :value="VO.value" />
        </v-col>
        <v-col cols="10" md="5">
          <span>Contact Number</span>
          <v-text-field v-model="dealData.priorBooking.contactNumber" label="Contact Number" type="number" @input="setContactnumber" solo rounded dense />
        </v-col>
        <v-col cols="10" md="5">
          <span>Email</span>
          <v-text-field v-model="dealData.priorBooking.email" label="Email" @input="setEmail" solo rounded dense />
        </v-col>
        <v-col cols="10" md="5">
          <span>Delivery</span>
          <v-select v-model="dealData.priorBooking.delivery" label="Delivery" :items="Delivery" item-text="name" item-value="val" solo rounded dense />
        </v-col>
        <v-col cols="10" md="5">
          <span>Delivery Area</span>
          <v-text-field v-model="dealData.priorBooking.deliveryArea" label="Delivery Area" @input="setDeliveryarea" solo rounded dense />
        </v-col>
        <v-col cols="10" md="5">
          <span>Prior Booking Status</span>
          <v-select v-model="dealData.priorBooking.status" label="Prior Booking Status" :items="Prior" item-text="name" item-value="val" @change="setPrior" solo rounded dense />
        </v-col>
        <v-col cols="10" class="mt-5 mr-5">Cash on delivery</v-col>
        <v-col cols="10" class="d-flex justify-content-center">
          <v-radio-group  v-model="dealData.paymentMethod" :mandatory="true" row>
            <v-radio label="Yes" value="Cash"></v-radio>
            <v-radio label="No" value="null"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="10" v-if="success != ''" class="d-flex justify-content-center">
          <notification notfi-color="greenNotfi">{{ success }}</notification>
        </v-col>
        <v-col cols="10" v-if="error != ''" class="d-flex justify-content-center">
          <notification notfi-color="redNotfi">{{ error }}</notification>
        </v-col>
        <v-col cols="10" v-if="loading" class="d-flex justify-content-center">
          <div class="spinner" />
        </v-col>
        <v-col cols="10" v-if="!loading" class="d-flex justify-content-center">
          <v-btn color="red" :preventClick="true" @click="confirmDeal" dark>Confirm Deal</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script lang="ts">
  import GoogleMapsNative from "~/components/en/General/GoogleMapsNative.vue"
  import {required, integer, email} from "vuelidate/lib/validators"
  import inputWithIcon2 from "~/components/en/General/inputWithIcon2.vue"
  import arinputWithIcon2 from "~/components/ar/General/arinputWithIcon2.vue"
  import selectInput from "~/components/en/General/selectInput.vue"
  import buttonWithColors from "~/components/en/General/buttonWithColors.vue"
  import notification from "~/components/en/General/notification.vue"
  import axios from 'axios'
  import { Deal } from '@/models/Deal'
  import { DealPrice } from '@/models/DealPrice'
  import { DealValidations } from '@/validations/Deal'
  import { ImageUploadService } from '@/services/image-upload.service'
  import { Component, Vue, Mixins } from 'vue-property-decorator'
  import { validationMixin } from "vuelidate/src"
  import { generateId } from '../../../utils'
  import { DealFormConst } from '../../../store/constant';
  @Component
  export class DealFormValidation extends Mixins(validationMixin) {}

  @Component({
    components: {
      GoogleMapsNative,
      inputWithIcon2,
      selectInput,
      buttonWithColors,
      notification,
      arinputWithIcon2,
    },

    data () {
      return {
        validations: DealValidations,
        isEdit: false,
        editImages: [],
        isImageRemoved: true
      }
    },

    mixins: [ DealFormValidation ]
  })
  export default class DealForm extends Vue {
    validations = DealValidations
    isEdit= false
    editImages= []
    isImageRemoved= true
    $v
    constructor() {
      super()
      this.$options.validations = DealValidations
    }

    created() { this.$v = this['_vuelidate'] ? this['_vuelidate'].refs.$v.proxy : { } }
    valid = false
    categories = []
    merchants = []
    branchesToShow = []
    success = ""
    error = ""
    loading = false
    flatCategories = []
    dealData = new Deal()//Object.assign(new Deal(), (require(`${__dirname}/mocked-data.json`)))
    file = ""
    types = DealFormConst.types
    dealTypes = DealFormConst.dealTypes
    dealKinds = DealFormConst.dealKinds
    vValid = DealFormConst.vValid
    validFor = DealFormConst.validFor
    Prior = DealFormConst.Prior
    PriorAr = DealFormConst.PriorAr
    Dine = DealFormConst.Dine
    Delivery = DealFormConst.Delivery
    DeliveryAr = DealFormConst.DeliveryAr
    Pay = DealFormConst.Pay
    $refs!: {
      form: any
      imageUpload: any
    }

    mounted() {
      let config = {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
      if (this.$route.params.idEdit != undefined) {
        this.isEdit = true;
        this.isImageRemoved = false;
        this.$axios.get("/deals/" + this.$route.params.idEdit, config)
          .then(async (data) => {
            this.dealData = data.data.deal;
            console.log('[data]', this.dealData.prices);
            this.dealData.merchant = this.dealData.merchant["_id"];
            this.setMerchant(this.dealData.merchant);
            let end_date, start_date = ""
            if (this.dealData.dealStartDate) {
              start_date = this.dealData.dealStartDate.split(":")[0] + ':' + this.dealData.dealStartDate.split(":")[1];
            }
            if (this.dealData.dealEndDate) {
              end_date = this.dealData.dealEndDate.split(":")[0] + ':' + this.dealData.dealEndDate.split(":")[1];
            }
            this.dealData.dealStartDate = start_date;
            this.dealData.dealEndDate = end_date;
            for (let x = 0; x < this.dealData.prices.length; x++) {
              let from_date, to_date = "";
              if (this.dealData.prices[x].pricesDate.dateDayFrom) {
                from_date = this.dealData.prices[x].pricesDate.dateDayFrom.split(":")[0] + ':' + this.dealData.prices[x].pricesDate.dateDayFrom.split(":")[1];
              }
              if (this.dealData.prices[x].pricesDate.dateDayTo) {
                to_date = this.dealData.prices[x].pricesDate.dateDayTo.split(":")[0] + ':' + this.dealData.prices[x].pricesDate.dateDayTo.split(":")[1];
              }
              this.dealData.prices[x] = {
                originalPrice: this.dealData.prices[x].originalPrice,
                finalPrice: this.dealData.prices[x].finalPrice,
                color: this.dealData.prices[x].color,
                size: this.dealData.prices[x].size,
                description: this.dealData.prices[x].description,
                arDescription: this.dealData.prices[x].arDescription,
                percentage: this.dealData.prices[x].percentage,
                payoutNet: this.dealData.prices[x].payoutNet,
                yallaDealzCommission: this.dealData.prices[x].yallaDealzCommission,
                pricesDate: {
                  dateDayFrom: from_date,
                  dateDayTo: to_date,
                },
                _id: this.dealData.prices[x]._id
              };
            }

            if (this.dealData.voucher.validUntil) {
              this.dealData.voucher.validUntil = this.dealData.voucher.validUntil.split(":")[0] + ':' + this.dealData.voucher.validUntil.split(":")[1];
            }
            let imgConfig = {
              responseType: 'blob' as "blob",
            }
            let images = [];
            this.editImages = []
            for (let x = 0; x < this.dealData.images.length; x++) {
              this.editImages.push(this.dealData.images[x]);
              let imageData = await this.$axios(this.dealData.images[x], imgConfig);
              console.log(imageData.data);
              images.push(new File([imageData.data], generateId(), { lastModified: Date.now() }));
            }
            this.dealData.images = [];
            for (let x = 0; x < images.length; x++) {
              await this.createImage(images[x])
            }
            console.log(this.dealData);
          });
      }
      this.$axios.get("/categories", config)
        .then((data) => {
          this.categories = data.data.data
          this.flattenCategoriesRecursively(this.categories)
        })
      this.$axios
        .get("/merchants", config)
        .then((data) => {
          console.log(data)
          this.merchants = data.data.merchants
        })
        .catch((error) => {
          console.log(error)
        })
    }
      add_price_form() {
        this.dealData.prices.push(new DealPrice());
      }
      delete_price_form(index) {
        this.$delete(this.dealData.prices, index)
      }
    async uploadImages() {

    }
    async confirmDeal() {
      this.loading = true
      const fake = false
      if (!this.$refs.form.validate()) {
        this.loading = false
        return
      } else {
        const imageCpy = [...this.dealData.images];
        if (this.isImageRemoved) {
          console.log('[isImageRemoved]');
          let dataImages = [];
          await this.dealData.images.map(({ file }) => { dataImages.push(file); });
          this.dealData.images = [];
          for (let i = 0; i < dataImages.length; i++) {
            this.dealData.images.push(await ImageUploadService.uploadImage(dataImages[i]));
          }
        }
        else if (this.isEdit) {
          this.dealData.images = this.editImages;
        }
        let config = {
          headers: {
            authorization: localStorage.getItem("token"),
          }
        }
        if (this.isEdit) {
          const deepData: Deal = JSON.parse(JSON.stringify(this.dealData))
          delete deepData.priorBooking["dineIn"];
          delete deepData["_id"];
          delete deepData["totalviews"];
          delete deepData["visible"];
          delete deepData["reviewRate"];
          delete deepData["rate"];
          delete deepData["totalRates"];
          delete deepData["totalUsersRated"];
          delete deepData["totalBuy"];
          delete deepData["isArchived"];
          delete deepData["slug"];
          delete deepData["rates"];
          delete deepData["createdAt"];
          delete deepData["updatedAt"];
          delete deepData["__v"];
          delete deepData["canReview"];
          delete deepData["userReview"];

          if (deepData.paymentMethod === 'Cash') {
            deepData.paymentMethod = ['Cash'];
          }
        
          await this.$axios.put("/deals/" + this.$route.params.idEdit, deepData, config)
            .then((result) => {
              this.success = "Deal Updated Successfully"
              this.loading = false
              this.$router.push('/en/dashboard/deals')
            }).catch((error) => {
              console.log(error)
              this.error = "Something wrong happened"
              this.loading = false;
              this.dealData.images = [...imageCpy];
            })
        } 
        else {
          const deepData: Deal = JSON.parse(JSON.stringify(this.dealData))
          delete deepData.percentage
          delete deepData.payoutNet
          delete deepData.yallaDealzCommission
          delete deepData.voucher.finalPrice

          for (const item of deepData.prices) {
            delete item["_id"]
          }

          if (deepData.branches.length === 0) {
            delete deepData.branches;
          }
          if (deepData.paymentMethod === 'Cash') {
            deepData.paymentMethod = ['Cash'];
          }else {
            delete deepData.paymentMethod
          }
          const myValidString = deepData.voucher.validFor
          await this.$axios.post("/deals", deepData, config)
            .then((result) => {
              this.success = "Added to Deals"
              this.loading = false
              this.$router.push('/en/dashboard/deals')
            }).catch((error) => {
              console.log(error)
              this.error = "Something wrong happened"
              this.loading = false;
              this.dealData.images = [...imageCpy];
            })
        }
        console.log("end function")
      }
    }

    setMerchant(value) {

      this.dealData.merchant = value
      this.$v.dealData.merchant.$touch()
      let config = {
        headers: {
          authorization: localStorage.getItem("token"),
        }
      }
      console.log(config)
      this.$axios
        .get("/merchants/branches/" + this.dealData.merchant, config)
        .then((data) => {
          this.branchesToShow = data.data.branches
          console.log(data.data.branches)
        })
    }
    setCategory(value) {
      this.dealData.category = value
      this.$v.dealData.category.$touch()
    }
    setBranches(value) {
      this.dealData.branches = value
      this.$v.dealData.branches.$touch()
    }
      setName(value) {
        this.dealData.name = value
        this.$v.dealData.name.$touch()
      }
      setArname(value) {
        this.dealData.arName = value
        this.$v.dealData.arName.$touch()
      }
      setVideo(value) {
        this.dealData.video = value
      }
      setDeal(value) {
        this.dealData.type = value
        this.$v.dealData.type.$touch()
      }
      setDealType(value) {
        this.dealData.dealType = value
        this.$v.dealData.dealType.$touch()
      }
      setDate(value) {
        this.dealData.dealStartDate = value
        this.$v.dealData.dealStartDate.$touch()
      }
      setEndDate(value) {
        this.dealData.dealEndDate = value
        this.$v.dealData.dealEndDate.$touch()
      }
      setPercentage(index) {
        const percentage = this.dealData.prices[index].percentage
        const final_price = this.dealData.prices[index].finalPrice
        this.dealData.prices[index].yallaDealzCommission = (percentage*final_price)/100;
        this.dealData.prices[index].payoutNet = final_price - ((percentage*final_price)/100);
      }
      setPayoutNet(value) {
        this.dealData.payoutNet = value
        this.$v.dealData.payoutNet.$touch()
      }
      setYDcommission(value) {
        this.dealData.yallaDealzCommission = value
        this.$v.dealData.yallaDealzCommission.$touch()
      }
      setVfinalprice(value) {
        this.dealData.voucher.finalPrice = value
        this.$v.dealData.voucher.finalPrice.$touch()
      }
      setVvaliduntill(value) {
        this.dealData.voucher.validUntil = value
        this.$v.dealData.voucher.validUntil.$touch()
      }
      setVmqa(value) {
        this.dealData.voucher.minimumQuantityAllowed = value
        this.$v.dealData.voucher.minimumQuantityAllowed.$touch()
      }
      setVmxqa(value) {
        this.dealData.voucher.maximumQuantityAllowed = value
        this.$v.dealData.voucher.maximumQuantityAllowed.$touch()
      }
      setVuserallowedfrom(value) {
        this.dealData.voucher.userAllowedFrom = value
        this.$v.dealData.voucher.userAllowedFrom.$touch()
      }
      setVuserallowedfupto(value) {
        this.dealData.voucher.userAllowedUpto = value
        this.$v.dealData.voucher.userAllowedUpto.$touch()
      }
      setVallowedquanitity(value) {
        this.dealData.voucher.allowedQuantity = value
        this.$v.dealData.voucher.allowedQuantity.$touch()
      }
      setValidFor(value) {
        this.dealData.voucher.validFor = value
        this.$v.dealData.voucher.validFor.$touch()
      }
      setMinimumage(value) {
        this.dealData.voucher.minimumAge = value
        this.$v.dealData.voucher.minimumAge.$touch()
      }
      setVouchervalidon(value) {
        console.log(value)
        // this.dealData.voucher.validOn = value
        // this.$v.dealData.voucher.validOn.$touch()
      }
      setHighlight(value) {
        this.dealData.highlightes = value
        this.$v.dealData.highlightes.$touch()
      }
      setDescription(value) {
        this.dealData.description = value
      }
      setArDescription(value) {
        this.dealData.arDescription = value
      }
      setArhighlight(value) {
        this.dealData.arHighlightes = value
        this.$v.dealData.arHighlightes.$touch()
      }
      setContactnumber(value) {
        this.dealData.priorBooking.contactNumber = value
        this.$v.dealData.priorBooking.contactNumber.$touch()
      }
      setEmail(value) {
        this.dealData.priorBooking.email = value
        this.$v.dealData.priorBooking.email.$touch()
      }
      setPrior(value) {
        this.dealData.priorBooking.status = value
        this.$v.dealData.priorBooking.status.$touch()
      }
      setDeliveryarea(value) {
        this.dealData.priorBooking.deliveryArea = value
        this.$v.dealData.priorBooking.deliveryArea.$touch()
      }
      setDelivery(value) {
        this.dealData.priorBooking.delivery = value
        this.$v.dealData.priorBooking.delivery.$touch()
      }
      setPaymethod(value) {
        this.dealData.paymentMethod = value
        console.log(value, this.dealData.paymentMethod )
        this.$v.dealData.paymentMethod.$touch()
      }
    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      else {
        for (let i = 0; i < files.length; i++) {
          this.createImage(files[i])
          this.file = this.$refs.imageUpload.files[i]
        }
      }
      console.log('[filechange]', this.dealData);
    }
    async createImage(file) {
      const image: HTMLImageElement = await ImageUploadService.readImage(file)
      this.dealData.images.push({ file, base64: image.src });
    }
    removeImage() {
        this.isImageRemoved = true;
        this.dealData.images = []
      }
      removeSingleImage(index: number) {
        this.dealData.images.splice(index, 1)
      }
      flattenCategoriesRecursively(items) {
        items.forEach((cat) => {
          this.flatCategories.push(cat)
          if (cat.root.length) this.flattenCategoriesRecursively(cat.root)
          else return
        })
      }
  }
</script>

<style>
.pointer {
  cursor: pointer;
}
.ql-editor {
  min-height: 100%!important;
}
</style>
