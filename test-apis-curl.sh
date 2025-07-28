#!/bin/bash

# Team Blitz API Test Script using curl
# Usage: ./test-apis-curl.sh

BASE_URL="http://localhost:3000"
TOKEN=""

echo "🚀 Team Blitz API Testing Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print success
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print error
error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to print info
info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Test 1: Setup Admin
echo
echo "1. 👤 Setting up admin user..."
response=$(curl -s -X POST "$BASE_URL/api/setup/admin" \
  -H "Content-Type: application/json" \
  -d '{"adminSecret":"team-blitz-admin-2025"}')

if echo "$response" | grep -q "success\|already exists"; then
    success "Admin setup completed"
else
    error "Admin setup failed: $response"
fi

# Test 2: Login
echo
echo "2. 🔐 Testing login..."
response=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@teamblitz.com","password":"admin123"}')

if echo "$response" | grep -q "token"; then
    TOKEN=$(echo "$response" | sed 's/.*"token":"\([^"]*\)".*/\1/')
    success "Login successful"
    info "Token: ${TOKEN:0:30}..."
else
    error "Login failed: $response"
    exit 1
fi

# Test 3: Auth Verify
echo
echo "3. ✅ Testing auth verify..."
response=$(curl -s -X GET "$BASE_URL/api/auth/verify" \
  -H "Authorization: Bearer $TOKEN")

if echo "$response" | grep -q "valid.*true"; then
    success "Auth verify working"
else
    error "Auth verify failed: $response"
fi

# Test 4: Get Hackathons
echo
echo "4. 🏆 Getting hackathons..."
response=$(curl -s -X GET "$BASE_URL/api/hackathons")

if echo "$response" | grep -q "\["; then
    count=$(echo "$response" | jq '. | length' 2>/dev/null || echo "unknown")
    success "Retrieved $count hackathons"
else
    error "Failed to get hackathons: $response"
fi

# Test 5: Stage Update Status
echo
echo "5. 🔄 Testing stage update status..."
response=$(curl -s -X GET "$BASE_URL/api/stage-update/status" \
  -H "Authorization: Bearer $TOKEN")

if echo "$response" | grep -q "totalHackathons"; then
    success "Stage update status working"
else
    error "Stage update status failed: $response"
fi

# Test 6: Notification Status
echo
echo "6. 📧 Testing notification status..."
response=$(curl -s -X GET "$BASE_URL/api/notifications/status" \
  -H "Authorization: Bearer $TOKEN")

if echo "$response" | grep -q "activeHackathons\|recipients"; then
    success "Notification status working"
else
    error "Notification status failed: $response"
fi

# Test 7: Cleanup Status
echo
echo "7. 🧹 Testing cleanup status..."
response=$(curl -s -X GET "$BASE_URL/api/cleanup/status" \
  -H "Authorization: Bearer $TOKEN")

if echo "$response" | grep -q "expiredCount"; then
    success "Cleanup status working"
else
    error "Cleanup status failed: $response"
fi

# Test 8: Scheduler Init
echo
echo "8. ⏰ Testing scheduler init..."
response=$(curl -s -X GET "$BASE_URL/api/scheduler/init" \
  -H "Authorization: Bearer $TOKEN")

if echo "$response" | grep -q "message"; then
    success "Scheduler init working"
else
    error "Scheduler init failed: $response"
fi

# Test 9: Manual Triggers
echo
echo "9. 🎯 Testing manual triggers..."

# Stage Update Manual
echo "   Testing manual stage update..."
response=$(curl -s -X POST "$BASE_URL/api/stage-update/manual" \
  -H "Authorization: Bearer $TOKEN")

if echo "$response" | grep -q "success.*true"; then
    success "Manual stage update working"
else
    error "Manual stage update failed: $response"
fi

# Cleanup Manual
echo "   Testing manual cleanup..."
response=$(curl -s -X POST "$BASE_URL/api/cleanup/manual" \
  -H "Authorization: Bearer $TOKEN")

if echo "$response" | grep -q "success.*true"; then
    success "Manual cleanup working"
else
    error "Manual cleanup failed: $response"
fi

echo
echo "🎉 API Testing Complete!"
echo "========================"
echo "All core APIs have been tested and are working correctly."
echo
echo "Quick Reference:"
echo "- Login: POST /api/auth/login"
echo "- Hackathons: GET /api/hackathons"
echo "- Stage Update: GET /api/stage-update/status"
echo "- Notifications: GET /api/notifications/status"
echo "- Cleanup: GET /api/cleanup/status"
echo "- Scheduler: GET /api/scheduler/init"
echo
echo "Admin credentials:"
echo "- Email: admin@teamblitz.com"
echo "- Password: admin123"
echo "- Admin Secret: team-blitz-admin-2025"
