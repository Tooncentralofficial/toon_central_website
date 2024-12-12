"use client"

export const prevRoutes=(uid?:any)=>{
   return{
    library: `${window.location.origin}/user/library`,
    comic:`${window.location.origin}/comics/${uid}`
   }

}