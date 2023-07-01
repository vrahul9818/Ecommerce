class Apifeature {
    constructor(query , queryStr){
        this.query = query,
        this.queryStr= queryStr
    }
    
    search(){
       
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex : this.queryStr.keyword,
                $options: "i", 
            }
        }:{} 
        this.query = this.query.find({...keyword})

        return this
    }
    filter(){
        const copyqueryStry = {...this.queryStr} ;
        const removeFields = ["page","keyword","limit"]
        removeFields.forEach((key)=>{ delete copyqueryStry[key] })
        let quertStr =  JSON.stringify(copyqueryStry);
        quertStr = quertStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
        this.query = this.query.find(JSON.parse(quertStr));
        return this
    }

    pagination(resultPerPage){
        const currentpage = this.queryStr.page || 1;
        const skip = resultPerPage * (currentpage -1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this ;

    }
}
module.exports = Apifeature;