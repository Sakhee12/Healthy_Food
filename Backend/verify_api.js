const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function testEndpoints() {
    console.log("--- Starting API Verification ---");

    const endpoints = [
        { method: 'GET', url: '/admin/categories', name: 'Get Categories' },
        { method: 'POST', url: '/admin/categories/add', name: 'Add Category', data: { category_name: 'Test' } },
        { method: 'PUT', url: '/admin/categories/update/1', name: 'Update Category', data: { category_name: 'Test Update' } },
        { method: 'DELETE', url: '/admin/categories/delete/1', name: 'Delete Category' }
    ];

    for (const endpoint of endpoints) {
        try {
            const response = await axios({
                method: endpoint.method,
                url: `${BASE_URL}${endpoint.url}`,
                data: endpoint.data
            });
            console.log(`[PASS] ${endpoint.name}: Status ${response.status}`);
        } catch (error) {
            if (error.response) {
                console.log(`[FAIL] ${endpoint.name}: Status ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            } else {
                console.log(`[ERROR] ${endpoint.name}: ${error.message}`);
            }
        }
    }
}

testEndpoints();
