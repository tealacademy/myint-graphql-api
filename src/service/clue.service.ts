import { GetClueInput, ClueModel, CreateClueInput, IdeaModel, CreateIdeaInput } from '../schema/clue.schema'
import EdgeService from '../service/edge.service'
import TagService from './tag.service'
import { User } from '../schema/user.schema'
import { FRAME_EDGES } from '../types/message.label'

class ClueService {
  async createClue(input: CreateClueInput) {
    // check tag
    // if (input.tag)  {const newTags = await new TagService().handleTagList([input.tag], input.owner)}

    // create ideas
    const newIdeas = input.ideas
      ? input.ideas.map((idea) => {
          return this.createIdea(idea)
        })
      : undefined // ! does this work?

    const clue = await ClueModel.create({ ...input, ideas: newIdeas })

    // create edges
    const edgeService = new EdgeService()
    if (newIdeas) {
      for (const idea of newIdeas) {
        const edge = edgeService.createEdge({ ...input, nodeA: clue._id, nodeB: (await idea)._id, label: FRAME_EDGES.CLUE_IDEA })
      }
    }

    return clue
  }

  async createIdea(input: CreateIdeaInput) {
    // create ides
    const newIdea = await IdeaModel.create(input)

    return newIdea
  }

  async findClues() {
    // Pagination login
    return ClueModel.find().lean()
  }

  async findSingleClue(input: GetClueInput) {
    return ClueModel.findOne(input).lean()
  }

  async destroyClue(input: GetClueInput) {
    return ClueModel.deleteOne({ _id: input.Id })
  }

  /** Creates slides that do not exist yet and adjusts the input */
  async handleClueList(inputClues: CreateClueInput[]) {
    console.log('clues', inputClues)

    const newClues = []
    for (let clue of inputClues) {
      // If no ID, we need to create clue
      // if (clue.Id === '') {
      //   const nodeB = await this.createClue(clue)

      newClues.push(clue.Id === '' ? await this.createClue(clue) : { ...clue, _id: clue.Id })
      // }
    }
    return newClues
  }
}

export default ClueService
