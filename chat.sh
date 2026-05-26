#!/bin/bash

curl -s -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"$*\"}"