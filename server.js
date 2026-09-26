const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory Database for instant execution
let listings = [
    {
        id: 1,
        type: 'pg',
        title: 'Luxury Boys PG near University',
        location: 'North Campus',
        price: 8500,
        sharing: 'Double',
        amenities: ['WiFi', 'AC', 'Food Included', 'Laundry'],
        contact: '9876543210'
    },
    {
        id: 2,
        type: 'hostel',
        title: 'St. Mary Girls Hostel',
        location: 'Downtown',
        price: 6000,
        sharing: 'Triple',
        amenities: ['WiFi', 'Security', 'Gym'],
        contact: '9876543211'
    },
    {
        id: 3,
        type: 'roommate',
        title: 'Looking for flatmate in 2BHK flat',
        location: 'North Campus',
        price: 5000,
        sharing: 'Single',
        amenities: ['WiFi', 'Kitchen Access'],
        contact: '9876543212'
    }
];

// API Routes
app.get('/api/listings', (req, { query }, res) => {
    let filteredListings = [...listings];
    
    if (query.type && query.type !== 'all') {
        filteredListings = filteredListings.filter(item => item.type === query.type);
    }
    if (query.location) {
        filteredListings = filteredListings.filter(item => 
            item.location.toLowerCase().includes(query.location.toLowerCase())
        );
    }
    if (query.maxPrice) {
        filteredListings = filteredListings.filter(item => item.price <= parseInt(query.maxPrice));
    }

    res.json(filteredListings);
});

app.post('/api/listings', (req, res) => {
    const { type, title, location, price, sharing, amenities, contact } = req.body;
    
    if (!type || !title || !location || !price || !contact) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const newListing = {
        id: listings.length + 1,
        type,
        title,
        location,
        price: parseInt(price),
        sharing,
        amenities: amenities ? amenities.split(',').map(a => a.trim()) : [],
        contact
    };

    listings.push(newListing);
    res.status(201).json(newListing);
});

app.listen(PORT, () => {
    console.log(`Server running securely at http://localhost:${PORT}`);
});
