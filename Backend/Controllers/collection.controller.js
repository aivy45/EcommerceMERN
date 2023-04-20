import  Collection  from '../Models/collection.schema.js'
import asyncHandler from '../services/asyncHandler.js'
import CustomError from '../utilis/custormError.js'




/************
* @Create_Collection
* @route http://localhost:5000/api/collection
* @description name of the collection
* @parameters name
* @return User Object
 ***********/


export const createCollection = asyncHandler(async (req,res) =>{
    
    // take name  from frontend
    const {name} = req.body

    if(!name)
    {
        throw new CustomError("Collection is required", 400);
    }

    // add this name to database 
  const collection = await Collection.create({
        name
    })

    // send this response value to frontend
    res.status(200).json({
        success: true, 
        message: "Collection created successfully", 
        collection
    })
    
})



export const updateCollection = asyncHandler(async (req,res) =>{
    //existing value to be updated
    const {id: collectionId} = req.params
    // new value to get updated
    const {name} = req.body
     
    if(!name)
    {
        throw new CustomError("Collection is required", 400);
    }
   
    let updatedCollection = await Collection.findByIdAndUpdate(
        collectionId, 
        {
            name,
        },  // new thing that is passing
        {
            new:true,
            runValidators: true,
        }
    )

      
     if(!updatedCollection)
     {
        throw new CustomError("Collection not found", 400);
     }

     // send response to front end
     res.status(200).json({
        success: true, 
        message: "Collection updated successfully", 
        updatedCollection
     })

})
    


export const deleteCollection = asyncHandler(async (req,res) =>{
    const {id: collectionId} = req.params

const collectionDelete = await Collection.findByIdAndDelete(collectionId);

if(!collectionDelete)
{
    throw new CustomError("Collection not found"); 
}

collectionDelete.remove(); 

// send response to front end
res.status(200).json({
    success: true, 
    message: "Collection deleted successfully", 
 })

}
)



export const getAllCollections = asyncHandler(async(req,res)=>{
    const collections = await Collection.find(); 
    if(!collections)
    {
        throw new CustomError("No Collection found", 400)
    }

    res.status(200).json({
        success: true,
        message: "Collections found", 
        collections,
    })
})





