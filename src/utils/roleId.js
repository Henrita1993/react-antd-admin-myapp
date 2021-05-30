import {reqRoles} from '../api/index'

export const roleArry = async()=>{
    let result = await reqRoles.data
    result.map((item)=>{
        return{
            item.id:item.menus
        }

    })
    // result.reduce((pre, item) => {
    //     item.id:em.meitnus
    //     pre.push()
        
    // }, {})

   
    
}