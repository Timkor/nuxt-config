



export default ({env}) => {
    
    return {
        
        hardSource: env.quickBuild,
        parallel: env.quickBuild,

        extend(config, ctx) {
            
        }
    }
}