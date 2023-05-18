const express = require('express')
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

// midlewere 
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Happy Toys server is Running')
})

app.listen(port, () => {
    console.log(`Happy Toys server is Runnign on port: ${port}`);
})