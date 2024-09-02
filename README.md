# API Doc
- Get Single Event ( Pass id to query param )
  - CURL: curl --location 'http://localhost:3000/event-manage/event_id?id=66d4711adc6953d9a5b14c8d'
- Get All Event
  - CURL: curl --location 'http://localhost:3000/event-manage/all-event'
    
- Edit Event ( _id and brand_id is required )
  - CURL: `curl --location --request PATCH 'http://localhost:3000/event-manage/edit' \
--header 'Content-Type: application/json' \
--data '{
    "_id": "66d4711adc6953d9a5b14c8d",
    "brand_id": "66c9a63aac784b7dd017a4ef",
    "voucher_quantity": 102
}'`
