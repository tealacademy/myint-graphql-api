import { CreateMyinTSetInput, GetMyinTSetInput, MyinTSetModel } from '../schema/myintset.schema'
import { EdgeModel } from '../schema/edge.schema'

class MyinTSetService {
  async createMyinTSet(input: CreateMyinTSetInput) {
    return MyinTSetModel.create(input)
  }

  async findMyinTSets() {
    return MyinTSetModel.find().lean()
  }

  async findSingleMyinTSet(input: GetMyinTSetInput) {
    MyinTSetModel.findOne(input).lean()
    return MyinTSetModel.findOne(input).lean()
  }
}

export default MyinTSetService
