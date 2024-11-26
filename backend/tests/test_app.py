import unittest
from app import create_app

class FlaskTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()

    def test_get_players(self):
        response = self.client.get('/players')
        self.assertEqual(response.status_code, 200)

if __name__ == "__main__":
    unittest.main()
