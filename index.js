const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ShoppingList = require('./models/shopping-list');
const Recepielist = require('./models/recepie-list');
const app = express();
const bodyparser = require('body-parser');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors())

mongoose.connect('mongodb+srv://amit:hello@123@cluster0.o91y6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', 
    {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.post('/newShopping', async (req, res) => {
    console.log(req.body)
    const shopping = new ShoppingList(req.body);
    await shopping.save();
    res.send(true);

})

app.post('/editShopping/:Id', (req, res) => {
    ShoppingList.findById(req.params.Id, (err, update) => {
        if (err) {
            console.log(err);
            res.status(500).send(err)
        } else {
            update.name = req.body.name,
                update.amount = req.body.amount

            update.save((err, result) => {
                if (err) {
                    console.log(err);
                    res.status(400).send({
                        success: false,
                        message: "Error in update"
                    });
                } else {
                    console.log(result);
                    res.status(200).send({
                        success: true,
                        message: "Item Updated"
                    });
                }
            });
        }
    });
});

app.get('/getShopping', async (req, res) => {
    const shopping = await ShoppingList.find({})
    res.send(shopping);
})


app.get('/getShoppingById/:id', async (req, res) => {
    ShoppingList.findById(req.params.id, (err, result) => {
        if (err)
            console.log(err)
        else
            res.send(result);
    })

})

app.post('/deleteShopping/:id', (req, res) => {
    console.log(req.params);
    ShoppingList.findByIdAndRemove(req.params.id,
        (err, result) => {
            if (err) {
                console.log("error")
                res.status(400).send("error in delete")

            } else {
                res.send(true)
            }
        });
});


app.listen(3000, function () {
    console.log('Listening at 3000!');
})
