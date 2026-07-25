---
title: "Rest Api"
modified: "2026-07-25"
---

# My Experience With API

use http  status code  correctly  like 400  for bad  requests for further handling in client side we can  return business error  code,    example: "error_code: 23" keeping it  informative while dont 
display sensitive information  to user. 

client read  404 not found  or read from response body like cats:  [] it all depends  on  how each  company  standards there are  no global rules

carefully design how  the  fields  behave in  the  API  response for  example "admin_fee: 0" could  be mean  something in  finance,  or  maybe multi platform client (mobile, web) handling for existing existing logic have different mechanism, while client A treats "jelly: {}"   as empty object unhandled   the  other client treat  that as a  valid object,  we  the backend need to communicate clearly to  client how we handled it 

we need to consider worse case scenario if we  depends  on API whether it be communicating between company internal service or external service, as  we cannot make sure that heir service is consistent or maybe have a  bug in productiton that we  may now know by schema validation we define what the structure so only the response from the API that match with our definition will be parsed, and validate the data early are they return null or empty data.


