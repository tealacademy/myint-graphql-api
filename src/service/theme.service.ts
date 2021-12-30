import {
  CreateThemeInput,
  GetThemeInput,
  ThemeModel
} from "../schema/theme.schema"
import { User } from "../schema/user.schema"

class ThemeService {
    async createTheme(input: CreateThemeInput) { //} & { user: User["_id"] }) {
      return ThemeModel.create(input)
  }

  async findThemes() {
    // Pagination login
    return ThemeModel.find().lean()
  }

  async findSingleTheme(input: GetThemeInput) {
    return ThemeModel.findOne(input).lean()
  }
}

export default ThemeService
