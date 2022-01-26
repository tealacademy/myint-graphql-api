import { CreateSlideInput, GetSlideInput, SlideModel } from '../schema/slide.schema'
import { User } from '../schema/user.schema'

class SlideService {
  async createSlide(input: CreateSlideInput) {
    return SlideModel.create(input)
  }

  async findSlides() {
    // Pagination login
    return SlideModel.find().lean()
  }

  async findSingleSlide(input: GetSlideInput) {
    return SlideModel.findOne(input).lean()
  }
}

export default SlideService
