const axios = require('axios');

async function testTree() {
    try {
        const response = await axios.get('http://localhost:5001/api/admin/category-tree');
        console.log("Category Tree Response:");
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error("Error fetching tree:", error.response ? error.response.data : error.message);
    }
}

testTree();
