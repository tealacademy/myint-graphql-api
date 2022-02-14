import { GetSlideInput, SlideModel, CreateSlideInput, ListSlideObjectInput } from '../schema/slide.schema'
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

  async destroySlide(input: GetSlideInput) {
    return SlideModel.deleteOne({ _id: input.Id })
  }

  /** Creates slides that do not exist yet and adjusts the input */
  async handleClueList(inputSlides: CreateSlideInput[]) {
    console.log('slides', inputSlides)

    const newSlides = []
    for (let slide of inputSlides) {
      // If no ID, we need to create slide
      // if (slide.Id === '') {
      //   const nodeB = await this.createSlide(slide)

      // set ID of tag in piece
      newSlides.push(slide.Id === '' ? await this.createSlide(slide) : { ...slide, _id: slide.Id })
      // }
    }
    return newSlides
  }
}

export default SlideService
