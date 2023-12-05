export const CatchAsyncError= (theFunc:any) =>(req:any ,res:any,next:any) =>{
    Promise.resolve(theFunc(req,res,next)).catch(next);
};