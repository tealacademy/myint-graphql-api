import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { CreateThemeInput, GetThemeInput, Theme } from '../schema/theme.schema'
import ThemeService from '../service/theme.service'
import Context from '../types/context'

@Resolver()
export default class ThemeResolver {
  constructor(private themeService: ThemeService) {
    this.themeService = new ThemeService()
  }

  // @Authorized()
  @Mutation(() => Theme)
  createTheme(@Arg('input') input: CreateThemeInput, @Ctx() context: Context) {
    // Create complete document with filled 1:n relations for tags, slides
    const user = context.user!
    return this.themeService.createTheme(input) // , user: user?._id })
  }

  @Query(() => [Theme])
  themes() {
    return this.themeService.findThemes()
  }

  @Query(() => Theme)
  theme(@Arg('input') input: GetThemeInput, @Ctx() context: Context) {
    return this.themeService.findSingleTheme(input)
  }
}
