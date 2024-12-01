#!/usr/bin/env python3
"""
Simple script to test if the Django API is working
"""

import requests
import json

def test_api():
    print("Testing Django API...")
    
    try:
        # Test status endpoint
        response = requests.get('http://localhost:8001/api/status/', timeout=10)
        print(f"Status endpoint: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
        else:
            print(f"Error response: {response.text}")
            
        # Test departments endpoint
        response = requests.get('http://localhost:8001/api/departments/', timeout=10)
        print(f"Departments endpoint: {response.status_code}")
        if response.status_code == 200:
            print(f"Departments count: {len(response.json())}")
        else:
            print(f"Error response: {response.text}")
            
        # Test staff endpoint
        response = requests.get('http://localhost:8001/api/staff/', timeout=10)
        print(f"Staff endpoint: {response.status_code}")
        if response.status_code == 200:
            print(f"Staff count: {len(response.json())}")
        else:
            print(f"Error response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"Connection error: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")

if __name__ == "__main__":
    test_api()
