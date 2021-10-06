# @sendyit/payment

## How to use
```
npm install @sendyit/payment
```

got to the src/main.js and add the following lines

```
import router from './router'
import store from './store'
import paymentlib from '@vmisiko/payment';

Vue.use(paymentlib, {
  store,
  router,
  config: {
    BASE_URL: '/payment-service-base-url', // add payment service base URl
    VGS_VAULT_ID: 'txxxxxxxxxxx',
    VGS_ENVIRONMENT: 'sandbox', // environment is 'sandbox' for staging and 'production' for prod enironment'
  },
});
```


### How to call the payment library.

So there entry files:
 ```
 1. checkout
 2. payment-option
 ```

 To go to checkout page call the following method as shown below by passing the Bu payload

 ```
  const buPayload = {
    user_id: this.user_id,
    entity_id: this.entity_id,
    currency: 'KES',
    country_code: 'KE',
    amount: this.amount,
    success_callback_url: '',
    fail_callback_url: '',
    txref: this.txref,
    bulk: false,
    mpesa_business_no: this.business_no,
    email: this.email,
    authToken: '', //Add Jwt token for authentication.
  };
  this.$paymentInit(buPayload, 'checkout'); //the 2nd argument can be a 'checkout' or 'payment-option', in order to access the two entry points of the Bu.
 ```

 ### How test and collaborate
 In order to help and collaborate, clone this repo, then add what you can improve, and build the npm version of the repo locally in the dist file in the root of the folder, using the below command

 ```
 npm run build-lib
 ```

 ### To version the App
 Use the below command for versioning of the app.

 ```
 npm version patch -m "Add a comment for the versioning"
 ```

 ### publish 

 in  order to publish the app, use the below command

 ```
 npm publish
 ```


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
