import requests
import sys
import json
from datetime import datetime

class MaverickAPITester:
    def __init__(self, base_url="https://maverick-gang.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_member_id = None
        self.test_quote_id = None  
        self.test_photo_id = None
        self.test_comment_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, check_response=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else self.api_url
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            response_data = {}
            
            try:
                response_data = response.json() if response.content else {}
            except:
                response_data = {}

            if success and check_response:
                success = check_response(response_data)

            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                if response_data and isinstance(response_data, dict) and 'id' in response_data:
                    print(f"   Response ID: {response_data['id']}")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                if response.content:
                    print(f"   Response: {response.text[:200]}")

            return success, response_data

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        success, response = self.run_test(
            "API Root",
            "GET", 
            "",
            200,
            check_response=lambda r: r.get('message') == 'Gangue da Maverick API'
        )
        return success

    def test_get_members(self):
        """Test getting all members"""
        success, response = self.run_test(
            "Get All Members",
            "GET",
            "members",
            200,
            check_response=lambda r: isinstance(r, list) and len(r) >= 0
        )
        return success, response

    def test_create_member(self):
        """Test creating a new member"""
        member_data = {
            "name": "Test Member",
            "nickname": "Testinho",
            "classification": "O Testador",
            "description": "Membro criado para testes automatizados",
            "characteristics": ["Testa APIs", "Verifica funcionalidades"],
            "current_status": "Ativo nos testes",
            "role": "QA Specialist",
            "photo_url": "https://via.placeholder.com/300"
        }
        
        success, response = self.run_test(
            "Create Member",
            "POST",
            "members",
            200,
            data=member_data,
            check_response=lambda r: r.get('name') == 'Test Member' and 'id' in r
        )
        
        if success and response.get('id'):
            self.test_member_id = response['id']
            
        return success

    def test_get_member_by_id(self):
        """Test getting a specific member by ID"""
        if not self.test_member_id:
            print("⚠️  Skipping - No member ID available")
            return False
            
        success, response = self.run_test(
            "Get Member by ID",
            "GET",
            f"members/{self.test_member_id}",
            200,
            check_response=lambda r: r.get('id') == self.test_member_id
        )
        return success

    def test_update_member(self):
        """Test updating a member"""
        if not self.test_member_id:
            print("⚠️  Skipping - No member ID available")
            return False

        update_data = {
            "description": "Membro atualizado via teste automatizado"
        }
        
        success, response = self.run_test(
            "Update Member",
            "PUT",
            f"members/{self.test_member_id}",
            200,
            data=update_data,
            check_response=lambda r: "atualizado" in r.get('description', '')
        )
        return success

    def test_create_comment(self):
        """Test creating a comment for a member"""
        if not self.test_member_id:
            print("⚠️  Skipping - No member ID available")
            return False

        comment_data = {
            "member_id": self.test_member_id,
            "author_name": "Test Author",
            "text": "Comentário de teste automatizado"
        }
        
        success, response = self.run_test(
            "Create Comment",
            "POST",
            "comments",
            200,
            data=comment_data,
            check_response=lambda r: r.get('member_id') == self.test_member_id and 'id' in r
        )
        
        if success and response.get('id'):
            self.test_comment_id = response['id']
            
        return success

    def test_get_comments(self):
        """Test getting comments for a member"""
        if not self.test_member_id:
            print("⚠️  Skipping - No member ID available")
            return False

        success, response = self.run_test(
            "Get Comments",
            "GET",
            f"comments/{self.test_member_id}",
            200,
            check_response=lambda r: isinstance(r, list)
        )
        return success

    def test_create_quote(self):
        """Test creating a quote"""
        quote_data = {
            "text": "Esta é uma citação de teste automatizado",
            "context": "Durante um teste de API",
            "member_id": self.test_member_id
        }
        
        success, response = self.run_test(
            "Create Quote",
            "POST",
            "quotes",
            200,
            data=quote_data,
            check_response=lambda r: "teste automatizado" in r.get('text', '') and 'id' in r
        )
        
        if success and response.get('id'):
            self.test_quote_id = response['id']
            
        return success

    def test_get_quotes(self):
        """Test getting all quotes"""
        success, response = self.run_test(
            "Get All Quotes",
            "GET",
            "quotes",
            200,
            check_response=lambda r: isinstance(r, list)
        )
        return success

    def test_create_photo(self):
        """Test creating a photo"""
        photo_data = {
            "url": "https://via.placeholder.com/400x300",
            "caption": "Foto de teste automatizado",
            "member_ids": [self.test_member_id] if self.test_member_id else []
        }
        
        success, response = self.run_test(
            "Create Photo",
            "POST",
            "photos",
            200,
            data=photo_data,
            check_response=lambda r: "teste automatizado" in r.get('caption', '') and 'id' in r
        )
        
        if success and response.get('id'):
            self.test_photo_id = response['id']
            
        return success

    def test_get_photos(self):
        """Test getting all photos"""
        success, response = self.run_test(
            "Get All Photos",
            "GET",
            "photos",
            200,
            check_response=lambda r: isinstance(r, list)
        )
        return success

    def test_delete_photo(self):
        """Test deleting a photo"""
        if not self.test_photo_id:
            print("⚠️  Skipping - No photo ID available")
            return False

        success, response = self.run_test(
            "Delete Photo",
            "DELETE",
            f"photos/{self.test_photo_id}",
            200,
            check_response=lambda r: r.get('message') == 'Photo deleted successfully'
        )
        return success

    def test_delete_quote(self):
        """Test deleting a quote"""
        if not self.test_quote_id:
            print("⚠️  Skipping - No quote ID available")
            return False

        success, response = self.run_test(
            "Delete Quote",
            "DELETE",
            f"quotes/{self.test_quote_id}",
            200,
            check_response=lambda r: r.get('message') == 'Quote deleted successfully'
        )
        return success

    def test_delete_member(self):
        """Test deleting a member (cleanup)"""
        if not self.test_member_id:
            print("⚠️  Skipping - No member ID available")
            return False

        success, response = self.run_test(
            "Delete Test Member",
            "DELETE",
            f"members/{self.test_member_id}",
            200,
            check_response=lambda r: r.get('message') == 'Member deleted successfully'
        )
        return success

def main():
    print("🚀 Starting Gangue da Maverick API Tests...")
    print(f"🌐 Testing against: https://maverick-gang.preview.emergentagent.com")
    
    tester = MaverickAPITester()

    # Run all tests in sequence
    test_results = []
    
    # Basic API tests
    test_results.append(tester.test_api_root())
    test_results.append(tester.test_get_members()[0])  # Only get success status
    
    # Member CRUD tests
    test_results.append(tester.test_create_member())
    test_results.append(tester.test_get_member_by_id())
    test_results.append(tester.test_update_member())
    
    # Comments tests
    test_results.append(tester.test_create_comment())
    test_results.append(tester.test_get_comments())
    
    # Quotes tests
    test_results.append(tester.test_create_quote())
    test_results.append(tester.test_get_quotes())
    
    # Photos tests
    test_results.append(tester.test_create_photo())
    test_results.append(tester.test_get_photos())
    
    # Cleanup tests
    test_results.append(tester.test_delete_photo())
    test_results.append(tester.test_delete_quote())
    test_results.append(tester.test_delete_member())

    # Print results
    print(f"\n📊 API Test Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    print(f"📈 Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All API tests passed!")
        return 0
    else:
        print("⚠️  Some API tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())