const express=require("express");

const app=express();

app.use(express.json());

const PORT=3000;

const rooms=[
    {
        id:1,
        name:"Hall 1",
        seats:135,
        pricePerHour:2000,
        amenities:[
            "A/C","Wifi","Parking"
        ]
    },
    {
        id:2,
        name:"Hall 2",
        seats:115,
        pricePerHour:1000,
        amenities:[
            "A/C","Wifi"
        ]
    }
]
const bookedRooms = [
    {
        id:1,
        customerName: "Person 1",
        roomID: 1,
        status: "booked",
        date: "02 sep 2021",
        startTime: "5:00:00",
        endTime: "8:00:00"
    },
    {
        id:2,
        customerName: "Person 2",
        roomID: 2,
        status: "booked",
        date: "04 sep 2021",
        startTime: "16:00:00",
        endTime: "20:00:00"
    }
]

app.get("/allRooms",(req,res)=>{
    res.json(rooms);
});

app.get("/allBookedRooms",(req,res)=>{
    res.json(bookedRooms);
});

app.post("/createRoom", (req, res) => {
    try {
        const obj = req.body;

        for(var i=0;i<rooms.length;i++)
        {
            if(rooms[i].id == req.body.id)
            {
                return res.status(400).send("This Room Id is already exisit")
            }
        }

        rooms.push(obj);
        console.log(rooms);
        res.status(201).send(`Room created`)
    } 
    catch (err)
     {
        res.status(500).json(err)
    }
})

app.post('/bookRoom', (req, res) => {
    try {
       
        const bookingdata = req.body.roomID;
        const BookedDateStartTime = new Date(`${req.body.date} ${req.body.startTime}`);
        const alreadyBooked = bookedRooms.some(detail => {
            const detailDateStartTime = new Date(`${detail.date} ${detail.startTime}`);
            const detailDateEndTime = new Date(`${detail.date} ${detail.endTime}`);
            if (detail.roomID === bookingdata && BookedDateStartTime >= detailDateStartTime && BookedDateStartTime <= detailDateEndTime) {
                return true;
            }
        })

        if (alreadyBooked) {
            res.json("Room not available!")
        } else {
            bookedRooms.push({
                ...req.body
            })
            console.log(bookedRooms);
            res.json("Room booked!")
        }

    } catch (err) {
        res.status(500).json(err)
    }
})


app.get('/rooms', (req, res) => {
    try {
        const data = bookedRooms.map(room => {
            const roomIndex = rooms.findIndex(obj => obj.id === room.roomID)
            return {
                roomName: rooms[roomIndex].name,
                customerName: room.customerName,
                bookedStatus: room.status,
                date: room.date,
                startTime: room.startTime,
                endTime: room.endTime
            }
        })
        res.send(data);
    } catch (err) {
        res.status(500).json(err)
    }
})


app.get('/customers', (req, res) => {
    try {
        const data = bookedRooms.map(room => {
            const roomIndex = rooms.findIndex(obj => obj.id === room.roomID)
            return {
                customerName: room.customerName,
                roomName: rooms[roomIndex].name,
                date: room.date,
                startTime: room.startTime,
                endTime: room.endTime
            }
        })
        res.send(data);
    } catch (err) {
        res.status(500).json(err)
    }
})

app.get('/customersAndrooms', (req, res) => {
    try {
        const data = bookedRooms.map(room => {
            const roomIndex = rooms.findIndex(obj => obj.id === room.roomID)
            return {
                customerName: room.customerName,
                roomName: rooms[roomIndex].name,
                date: room.date,
                startTime: room.startTime,
                endTime: room.endTime,
                bookingID:room.id,
                bookingdata:room.date,
                bookingStatus:room.status
            }
        })
        res.send(data);
    } catch (err) {
        res.status(500).json(err)
    }
})

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});