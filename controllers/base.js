
class BaseController {

    static failedResponse(res, data){
        const result = {success: false}
        result.data = data
        res.status(401).json(result)
    }
    static successResponse(res, data){
        const result = {success: true}
        result.data = data
        return res.json(result)
    }
    static failedServerResponse(res, data){
        const result = {success: false}
        result.data = data
        return res.status(500).json(result)
    }
}

module.exports = BaseController