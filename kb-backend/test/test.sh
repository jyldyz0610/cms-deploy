#!/bin/bash

URL="http://localhost"
PORT="3000"
HEADER="Content-Type: application/json"


http_query() {
  METHOD=$1
  ROUTE=$2
  PAYLOAD=$3

  echo "Testing $METHOD Route $ROUTE:"
  if [ "$METHOD" = "GET" ]; then
  	curl -XGET -H"$HEADER" -H 'Accept: application/json' "$URL:$PORT$ROUTE"
  else
  	curl -X"$METHOD" -H"$HEADER" -H 'Accept: application/json' "$URL:$PORT$ROUTE" -d "$PAYLOAD"
  fi
  echo 
} # http_query function

http_query GET /links
http_query PUT /link/1 '{}' 
http_query DELETE /link/1 '{}'
http_query POST /link '{"link":"neues link"}'
http_query PATCH /link/2 '{"link":"neues gepatches link"}' 
