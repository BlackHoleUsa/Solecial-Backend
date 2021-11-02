const Setting = require('../models/setting.model')

const getSettings = async ()=>{
    const result=await Setting.find()
    return result;
}
const updateSettings=async (id,updateBody)=>{
   const result = Setting.findByIdAndUpdate(id,updateBody,{new:true})
   return result;
}

const createSettings= async (body)=>{
    const setting=await Setting.create(body);
    console.log('service',setting);
    return setting
}

module.exports={
    getSettings,
    updateSettings,
    createSettings
}