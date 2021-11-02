const mongoose = require('mongoose')
const { toJSON } = require('./plugins');

const settingSchema= mongoose.Schema({
    minimum_bid:{ 
        type:Number,
        required:false
    },
    notifications:{
        type:Boolean,
        required:false
    },
    bid_notifications:{
        type:Boolean,
        required:false
    },
    royalty:{
        type:Number,
        required:false
    }
},
    {timeStamps:true}
)

settingSchema.plugin(toJSON);
/**
 * @typedef Token
 */

const settings = mongoose.model("Settings",settingSchema);

module.exports = settings;
