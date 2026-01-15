#!/bin/bash

# Simple script to test all API endpoints


BASE_URL="https://europe-west1-medverse-84505.cloudfunctions.net"

echo "Starting API tests..."
echo ""

# Test 1: Create a new session
echo "1. Create Session"
RESPONSE=$(curl -s -X POST "$BASE_URL/createSession" \
  -H "Content-Type: application/json" \
  -d '{"region": "eu-central"}')


echo "$RESPONSE"
echo ""

# Get the token from the response (look for "token":"...")
TOKEN=$(echo "$RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Check if we got a token
if [ -z "$TOKEN" ]; then
  echo "Error: No token received"
  exit 1
fi

echo "Got token: ${TOKEN:0:30}..."
echo ""

# Test 2: Get the session using the token
echo "2. Get Session"
curl -s -X GET "$BASE_URL/getSession" \
  -H "Authorization: Bearer $TOKEN"
echo ""
echo ""

# Test 3: Update session status using the token
echo "3. Update Session Status"
curl -s -X PATCH "$BASE_URL/updateSessionStatus" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "active"}'
echo ""
echo ""

# Test 4: List sessions using the token for authentication
echo "4. List Sessions"
curl -s -X GET "$BASE_URL/listSessions?limit=5" \
  -H "Authorization: Bearer $TOKEN"
echo ""
echo ""

echo "All tests complete!"
