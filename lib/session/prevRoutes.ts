"use client"

export const prevRoutes=(uid?:string)=>{
   return{
    library: `${window.location.origin}/user/library`,
    comic:`${window.location.origin}/comics/${uid}`
   }

}