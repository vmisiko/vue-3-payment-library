|  payload |   type| (optional / mandatory) | Description|
|---|---|---|---|
|  `enitity_id` | Integer  |  Mandatory |  BU entity ID |
|  `bulk` |  Boolean |   Mandatory |   bulk payment or not|
|  `currency` | string | Mandatory  |  Country currency|
|  `country_code` | string | Mandatory  |  Country code|
|  `email` | string | Mandatory  |  Email|
|  `fail_callback_url` | string | optional  | failure call back url|
|  `authToken` | string | Mandatory  |  Jwt token for the passing to payment Ui library http request headers. (Must).|
|  `paybill_no` | string | Mandatory  |  Mpesa payBill no.|
|  `success_callback_url` | string | optional  |  success_callback_url|
|  `payment_options` | list | optional  |  This payment option is required to be able filter the kind of payment methods that a user wants it to be displayed to the client. i.e '[1,2,20]', this are pay methods id's that are passed to filter the kind of payment methods you want displayed. ie. 1 is for M-PESA, 2 is for card, and 20 is for Pay with Transfer.|
|  `amount` | Float | Mandatory  |  Total amount to be paid |
|  `txref` | string | Mandatory  |  Transaction reference|
|  `user_id` | Alpha Numeric | Mandatory  |  user id of the current user|
|  `firstname` | string | optional |  firstname - Mandatory(for Pay with Transfer) |
|  `lastname` | string | optional   |  lastname - Mandatory(for Pay with Transfer)|
|  `resolve_payment_message` | string | optional  |  Note: This is required in the resolve payment checkout entry point.|



