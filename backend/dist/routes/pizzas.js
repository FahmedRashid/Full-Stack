"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Get all workouts from DB
// router.get('/', async(req:Request, res:Response) =>{
//     try{
//         const result = await pool.query('SELECT * FROM workouts');
//         res.json(result.rows);
//     }catch(error){
//         console.error(error);
//         res.status(500).json({error: 'Server error'})
//     }
//     res.json({mssg: 'Get all workouts'})
// })
// Get all workouts 
router.get('/', (req, res) => {
    res.json({ mssg: 'Get all workouts' });
});
// Get a Single workouts
router.get('/:id', (req, res) => {
    res.json({ mssg: 'Get a single workout' });
});
// POST a Single workouts
router.post('/', (req, res) => {
    res.json({ mssg: 'POST a single workout' });
});
// DELETE a Single workouts
router.delete('/:id', (req, res) => {
    res.json({ mssg: 'Delete a workout' });
});
// UPDATE a Single workouts
router.patch('/:id', (req, res) => {
    res.json({ mssg: 'Update a single workout' });
});
exports.default = router;
