
class BaseController {

    static failedResponse(res, data){
        const result = {success: false}
        result.data = data
        res.json(result)
    }
    static successResponse(res, data){
        const result = {success: true}
        result.data = data
        return res.json(result)
    }
}

module.exports = BaseController