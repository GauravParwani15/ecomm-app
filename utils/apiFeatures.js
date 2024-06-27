class ApiFeatures{
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    search(){
        const keyword = this.queryString.keyword ? {
            name: { 
                $regex: this.queryString.keyword, 
                $options: 'i' 
            }
        } : {}

        console.log(keyword);
        this.query = this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryCopy = { ...this.queryString };

        //Removing fields from the query that are not allowed
        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach(field => delete queryCopy[field]);

        
        console.log(queryCopy);
        //Advance filtering for price and ratings range
        let queryString = JSON.stringify(queryCopy);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        
        console.log(queryString);
        this.query = this.query.find(JSON.parse(queryString));
        return this;
    }

    pagination(resPerPage){
        const currentPage = Number(this.queryString.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        this.query = this.query.skip(skip).limit(resPerPage);
        return this;
    }
}

module.exports = ApiFeatures;